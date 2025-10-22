// controllers/frontend/ClubRegistration/ApplyClubAccountController.js

import ClubApplication from '../../../models/frontend/ClubRegistration/ApplyClubAccountModel.js';

import { sendClubAppStatusEmail } from '../../../emails/clubApplicationEmails.js';

/** shape responder: never send buffers */
const toPublic = (doc) => {
  const o = doc.toObject({ getters: false, virtuals: false });
  const d = o.documents || {};
  const lite = (x) =>
    x
      ? {
          fileName: x.fileName,
          fileType: x.fileType,
          fileSize: x.fileSize,
          hasAsset: !!x.fileSize,
        }
      : null;

  return {
    ...o,
    documents: {
      constitution: lite(d.constitution),
      clubLicense: lite(d.clubLicense),
      contactId: lite(d.contactId),
      supporting: Array.isArray(d.supporting) ? d.supporting.map(lite) : [],
    },
  };
};

const REQUIRED_FIELDS = ['clubName', 'province', 'district', 'address', 'contactName', 'contactEmail'];

/** POST /api/club-applications  (multipart) */
export const create = async (req, res) => {
  try {
    if (!req.body?.payload) return res.status(400).json({ message: 'Missing payload' });

    let payload;
    try {
      payload = JSON.parse(req.body.payload);
    } catch {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    for (const k of REQUIRED_FIELDS) {
      if (!payload?.[k]) return res.status(400).json({ message: `Missing field: ${k}` });
    }

    const files = req.files || {};
    const one = (a) => (Array.isArray(a) && a[0] ? a[0] : null);
    const pack = (f) =>
      f
        ? {
            fileName: f.originalname,
            fileType: f.mimetype,
            fileSize: f.size,
            asset: f.buffer,
          }
        : undefined;

    const doc = new ClubApplication({
      // step 1
      clubName: payload.clubName,
      yearFounded: payload.yearFounded,
      province: payload.province,
      district: payload.district,
      address: payload.address,
      licenseNumber: payload.licenseNumber,

      // step 2
      contactName: payload.contactName,
      contactRole: payload.contactRole,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,

      // step 3
      officials: (payload.officials || [])
        .filter((x) => x && x.fullName)
        .map((x) => ({ fullName: x.fullName, role: x.role, nrc: x.nrc })),

      // step 4: buffers
      documents: {
        constitution: pack(one(files.constitution)),
        clubLicense: pack(one(files.clubLicense)),
        contactId: pack(one(files.contactId)),
        supporting: (files.supporting || []).map(pack).filter(Boolean),
      },

      status: 'under-review',
    });

    await doc.save();
    return res.status(201).json(toPublic(doc));
  } catch (e) {
    console.error('Create ClubApplication failed:', e);
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};

/** GET /api/club-applications  (list + search + pagination) */
export const list = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
    const status = req.query.status; // 'all' or enum
    const q = (req.query.q || '').toString().trim();

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (q) {
      filter.$or = [
        { clubName: { $regex: q, $options: 'i' } },
        { contactName: { $regex: q, $options: 'i' } },
        { contactEmail: { $regex: q, $options: 'i' } },
        { province: { $regex: q, $options: 'i' } },
        { district: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      ClubApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('clubName contactName contactEmail province district status createdAt documents')
        .lean(),
      ClubApplication.countDocuments(filter),
    ]);

    const mapDoc = (d) => ({
      _id: d._id,
      clubName: d.clubName,
      applicant: d.contactName,
      createdAt: d.createdAt,
      status: d.status,
      location: [d.district, d.province].filter(Boolean).join(', '),
      documents: {
        constitution: !!d?.documents?.constitution?.fileSize,
        clubLicense: !!d?.documents?.clubLicense?.fileSize,
        contactId: !!d?.documents?.contactId?.fileSize,
        supporting: Array.isArray(d?.documents?.supporting) ? d.documents.supporting.length : 0,
      },
    });

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ page, limit, total, items: items.map(mapDoc) });
  } catch (e) {
    console.error('List ClubApplications failed:', e);
    return res.status(500).json({ message: 'Failed to list applications' });
  }
};

/** GET /api/club-applications/_counts */
export const counts = async (req, res) => {
  try {
    const agg = await ClubApplication.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]);
    const dict = Object.fromEntries(agg.map((x) => [x._id, x.n]));
    const total = await ClubApplication.estimatedDocumentCount();
    return res.status(200).json({
      total,
      underReview: dict['under-review'] || 0,
      pendingDocs: dict['pending-docs'] || 0,
      approved: dict['approved'] || 0,
      rejected: dict['rejected'] || 0,
    });
  } catch (e) {
    console.error('Counts failed:', e);
    return res.status(500).json({ message: 'Failed to get counts' });
  }
};

/** GET /api/club-applications/:id (metadata only) */
export const getOne = async (req, res) => {
  try {
    const doc = await ClubApplication.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(toPublic(doc));
  } catch {
    return res.status(500).json({ message: 'Failed to fetch application' });
  }
};

/**
 * GET /api/club-applications/:id/download/:kind
 * GET /api/club-applications/:id/download/:kind/:index
 * (we use two explicit routes; no optional params)
 */
export const download = async (req, res) => {
  try {
    const { id, kind } = req.params;

    // parse index only if provided
    const hasIndex = Object.prototype.hasOwnProperty.call(req.params, 'index');
    let idx = undefined;
    if (hasIndex) {
      idx = Number.parseInt(req.params.index, 10);
      if (Number.isNaN(idx) || idx < 0) return res.status(400).json({ message: 'Invalid index' });
    }

    // select buffers explicitly
    const select = [
      'documents.constitution.asset',
      'documents.clubLicense.asset',
      'documents.contactId.asset',
      'documents.supporting.asset',
      'documents.constitution.fileName',
      'documents.clubLicense.fileName',
      'documents.contactId.fileName',
      'documents.supporting.fileName',
      'documents.constitution.fileType',
      'documents.clubLicense.fileType',
      'documents.contactId.fileType',
      'documents.supporting.fileType',
    ].join(' ');

    const doc = await ClubApplication.findById(id).select(select);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const D = doc.documents || {};
    let f = null;

    if (kind === 'constitution') {
      f = D.constitution;
    } else if (kind === 'clubLicense') {
      f = D.clubLicense;
    } else if (kind === 'contactId') {
      f = D.contactId;
    } else if (kind === 'supporting') {
      const arr = Array.isArray(D.supporting) ? D.supporting : [];
      const pos = hasIndex ? idx : 0;
      f = arr[pos];
    } else {
      return res.status(400).json({ message: 'Invalid kind' });
    }

    if (!f || !f.asset) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', f.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(f.fileName || 'document')}"`);
    return res.status(200).send(f.asset);
  } catch (e) {
    console.error('Download failed:', e);
    return res.status(500).json({ message: 'Failed to download' });
  }
};

/** PATCH /api/club-applications/:id/status  (approve/reject/pending-docs/under-review) */
// ... inside updateStatus
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body || {};
    const allowed = ['under-review','pending-docs','approved','rejected'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const doc = await ClubApplication.findByIdAndUpdate(
      id,
      { $set: {
        status,
        review: { notes: notes || '', updatedAt: new Date(), updatedBy: req?.user?.email || 'admin' },
      }},
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // send email (fire-and-forget)
    sendClubAppStatusEmail(doc, status, notes).catch((e) =>
      console.error('notify status change failed:', e)
    );

    return res.status(200).json({ ok: true, status: doc.status });
  } catch (e) {
    console.error('Update status failed:', e);
    return res.status(500).json({ message: 'Failed to update status' });
  }
};

// delete /.../ApplyClubAccountController.js
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ClubApplication.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Delete failed:', e);
    return res.status(500).json({ message: 'Failed to delete' });
  }
};



