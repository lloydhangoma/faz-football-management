///controllers/Clubs-Management-Panel/RegisterFromApplicationController.js



import stream from 'stream';
import cloudinary from '../../config/cloudinary.js';
import ClubsAdminPortalLogin from '../../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';
import ClubApplication from '../../models/frontend/ClubRegistration/ApplyClubAccountModel.js';

const REQUIRE_TOKEN = String(process.env.CLUBS_REQUIRE_SIGNUP_TOKEN || 'false').toLowerCase() === 'true';

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const opts = {
      folder: folder || process.env.CLOUDINARY_FOLDER || 'faz/clubs',
      resource_type: 'image',
      overwrite: true,
    };
    const up = cloudinary.uploader.upload_stream(opts, (err, result) => err ? reject(err) : resolve(result));
    pass.end(buffer);
    pass.pipe(up);
  });

/**
 * POST /api/clubs-panel/club/register   (multipart/form-data)
 * DEV (REQUIRE_TOKEN=false): open self-serve registration (no application token)
 * PROD (REQUIRE_TOKEN=true): requires approved application (applicationId/id + token)
 */
export const registerFromApplication = async (req, res) => {
  try {
    let email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    if (!email)    return res.status(400).json({ ok: false, message: 'Email is required' });
    if (!password) return res.status(400).json({ ok: false, message: 'Password is required' });

    const existing = await ClubsAdminPortalLogin.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, message: 'Account with this email already exists' });

    // Optional logo
    let logo = { url: '', publicId: '' };
    if (req.file?.buffer) {
      const up = await uploadBuffer(req.file.buffer, process.env.CLOUDINARY_FOLDER);
      logo = { url: up.secure_url, publicId: up.public_id };
    }

    if (!REQUIRE_TOKEN) {
      // DEV: create directly from form fields
      const required = (v) => typeof v === 'string' && v.trim().length > 0;
      if (!required(req.body.clubName) || !required(req.body.province) || !required(req.body.league)) {
        return res.status(400).json({ ok: false, message: 'Missing required club fields (clubName, province, league)' });
      }

      const admin = await ClubsAdminPortalLogin.create({
        name: `${req.body.clubName} Admin`,
        email,
        role: 'Club Admin',
        password,
        club: {
          name: req.body.clubName,
          abbreviation: req.body.clubAbbreviation || '',
          logo,
          homeStadium: req.body.homeStadium || '',
          province: req.body.province,
          foundingYear: req.body.foundingYear ? Number(req.body.foundingYear) : undefined,
          league: req.body.league,
          currentLeaguePosition: req.body.currentLeaguePosition ? Number(req.body.currentLeaguePosition) : undefined,
          previousLeaguePosition: req.body.previousLeaguePosition ? Number(req.body.previousLeaguePosition) : undefined,
          leagueTitles: req.body.leagueTitles ? Number(req.body.leagueTitles) : 0,
          cupsWon: req.body.cupsWon ? Number(req.body.cupsWon) : 0,
          presidentName: req.body.presidentName || '',
          contactPhone: req.body.contactPhone || '',
          websiteUrl: req.body.websiteUrl || '',
          socialMediaLinks: req.body.socialMediaLinks || '',
        },
      });

      return res.status(201).json({
        ok: true,
        message: 'Club registered successfully (dev mode). You can log in now.',
        admin: { _id: admin._id, email: admin.email, role: admin.role },
        club: {
          name: admin.club?.name,
          logoUrl: admin.club?.logo?.url || '',
          province: admin.club?.province,
          league: admin.club?.league,
        }
      });
    }

    // PROD: must have approved application + valid token
    const id = String(req.body.applicationId || req.body.id || '').trim();
    const token = String(req.body.token || '').trim();
    if (!id || !token) {
      return res.status(400).json({ ok: false, message: 'Missing application id/token' });
    }

    const app = await ClubApplication.findById(id);
    if (!app) return res.status(404).json({ ok: false, message: 'Application not found' });
    if (app.status !== 'approved') return res.status(403).json({ ok: false, message: 'Application not approved' });

    const s = app.signup || {};
    if (!s.token || s.token !== token) return res.status(403).json({ ok: false, message: 'Invalid token' });
    if (s.consumedAt) return res.status(410).json({ ok: false, message: 'Token already used' });
    if (s.expiresAt && new Date(s.expiresAt) < new Date()) {
      return res.status(410).json({ ok: false, message: 'Token expired' });
    }

    const clubName = req.body.clubName?.trim() || app.clubName;
    const province = req.body.province?.trim() || app.province;
    const league   = req.body.league?.trim() || '';

    const admin = await ClubsAdminPortalLogin.create({
      name: `${clubName} Admin`,
      email,
      role: 'Club Admin',
      password,
      club: {
        name: clubName,
        abbreviation: req.body.clubAbbreviation || '',
        logo,
        homeStadium: req.body.homeStadium || '',
        province,
        foundingYear: req.body.foundingYear ? Number(req.body.foundingYear) : undefined,
        league,
        currentLeaguePosition: req.body.currentLeaguePosition ? Number(req.body.currentLeaguePosition) : undefined,
        previousLeaguePosition: req.body.previousLeaguePosition ? Number(req.body.previousLeaguePosition) : undefined,
        leagueTitles: req.body.leagueTitles ? Number(req.body.leagueTitles) : 0,
        cupsWon: req.body.cupsWon ? Number(req.body.cupsWon) : 0,
        presidentName: req.body.presidentName || '',
        contactPhone: req.body.contactPhone || '',
        websiteUrl: req.body.websiteUrl || '',
        socialMediaLinks: req.body.socialMediaLinks || '',
      },
    });

    app.signup.consumedAt = new Date();
    await app.save();

    return res.status(201).json({
      ok: true,
      message: 'Club portal account created (approved application). You can log in now.',
      admin: { _id: admin._id, email: admin.email, role: admin.role },
      club: {
        name: admin.club?.name,
        logoUrl: admin.club?.logo?.url || '',
        province: admin.club?.province,
        league: admin.club?.league,
      }
    });
  } catch (e) {
    console.error('registerFromApplication failed:', e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};
