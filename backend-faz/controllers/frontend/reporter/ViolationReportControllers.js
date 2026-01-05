// controllers/frontend/reporter/ViolationReportControllers.js


// controller/frontend/reporter/ViolationReportController.js
import ViolationReport from '../../../models/frontend/reporter/ViolationReports.js';
import cloudinary from '../../../config/cloudinary.js';
import Counter from '../../../models/frontend/reporter/ReportersCountersID.js'; // ✅ New counter model

// ✅ Automatically and safely generate unique report IDs
const generateReportId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'reportId' },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,              // ✅ auto-creates the counter if it doesn't exist
      setDefaultsOnInsert: true, // ✅ starts with seq: 0
    }
  );

  return `RPT-${String(counter.seq).padStart(3, '0')}`;
};

export const submitViolationReport = async (req, res) => {
  try {
    const {
      title,
      violationType,
      description,
      perpetrator,
      victim,
      city,
      district,
      datetime,
      visibility,
      consent1,
      consent2,
    } = req.body;

    const reporterId = req.user._id;
    const reportId = await generateReportId();

    const uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mimetype = file.mimetype;

        if (
          mimetype === 'application/pdf' ||
          mimetype.includes('word') ||
          mimetype.includes('officedocument')
        ) {
          uploadedFiles.push({
            storage: 'database',
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
          });
        } else {
          let folder = 'lizibiso_reports/others';
          let resource_type = 'raw';

          if (mimetype.startsWith('image/')) {
            folder = 'lizibiso_reports/images';
            resource_type = 'image';
          } else if (mimetype.startsWith('video/')) {
            folder = 'lizibiso_reports/videos';
            resource_type = 'video';
          } else if (mimetype.startsWith('audio/')) {
            folder = 'lizibiso_reports/audio';
            resource_type = 'video'; // Cloudinary treats audio as video
          }

          const streamUpload = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type, folder },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );
              stream.end(file.buffer);
            });
          };

          const result = await streamUpload();

          uploadedFiles.push({
            storage: 'cloudinary',
            url: result.secure_url,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });
        }
      }
    }

    const report = new ViolationReport({
      reportId,
      reporterId,
      title,
      violationType,
      description,
      perpetrator,
      victim,
      city,
      district,
      datetime,
      visibility,
      consent1,
      consent2,
      files: uploadedFiles,
      // Removed explicit status: "Pending" - schema default handles it
    });

    console.log('Uploaded files:', uploadedFiles);

    await report.save();

    res.status(201).json({ message: 'Report submitted successfully', reportId });
  } catch (error) {
    console.error('Submit Report Error:', error);
    res.status(500).json({ message: 'Failed to submit report', error: error.message });
  }
};

// ✅ Serve document stored in MongoDB
export const getDocumentFile = async (req, res) => {
  const { reportId, filename } = req.params;
  console.log('➡️ GET DOCUMENT FILE HIT:', { reportId, filename });

  try {
    let report = await ViolationReport.findOne({ reportId });
    if (!report) {
      report = await ViolationReport.findById(reportId);
    }

    if (!report) {
      console.warn(`❌ Report not found: ${reportId}`);
      return res.status(404).send('Report not found');
    }

    const file = report.files.find((f) => f.originalname === filename);
    if (!file) {
      console.warn(`❌ File not found: ${filename} in report ${reportId}`);
      return res.status(404).send('File not found');
    }

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.originalname}"`,
      'Access-Control-Allow-Origin': '*',
    });

    res.send(file.buffer);
  } catch (error) {
    console.error('🔥 getDocumentFile error:', error);
    res.status(500).send('Server error');
  }
};












// getting the statistics controller down here in dashboard for reporter
export const getReporterStats = async (req, res) => {
  try {
    const reporterId = req.user._id;

    const reports = await ViolationReport.find({ reporterId });

    const stats = {
      total: reports.length,
      underReview: reports.filter(r => r.status === 'Under Review').length, // Updated to 'Under Review'
      resolved: reports.filter(r => r.status === 'Resolved').length,
      urgent: reports.filter(r => r.priority === 'High').length,
      recentReports: reports.slice(-4).reverse(), // latest 4
    };

    res.json(stats);
  } catch (error) {
    console.error('Get Reporter Stats Error:', error);
    res.status(500).json({ message: 'Failed to get reporter stats' });
  }
};

// ✅ ✅ ✅ SECTION: UPDATE REPORT CONTROLLER (EDIT FUNCTIONALITY)
export const updateReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const reporterId = req.user._id;
    const updates = req.body;

    const report = await ViolationReport.findOne({ _id: id, reporterId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    // Updated to check all non-Pending statuses
    const lockedStatuses = ['Under Review', 'Resolved', 'In Progress', 'Rejected', 'Suspended'];
    if (lockedStatuses.includes(report.status)) {
      return res.status(403).json({ message: 'Cannot edit this report. It is in a locked state.' });
    }

    const updatedReport = await ViolationReport.findOneAndUpdate(
      { _id: id, reporterId },
      updates,
      { new: true }
    );

    res.json({
      message: 'Report updated successfully',
      report: updatedReport,
    });
  } catch (error) {
    console.error('Update Report Error:', error);
    res.status(500).json({ message: 'Failed to update report', error: error.message });
  }
};

// ✅ ✅ ✅ SECTION: GET ALL REPORTS FOR LOGGED-IN REPORTER
export const getMyReports = async (req, res) => {
  try {
    const reporterId = req.user._id;
    const reports = await ViolationReport.find({ reporterId }).sort({ createdAt: -1 }); // Updated to use createdAt
    res.json(reports);
  } catch (error) {
    console.error("Get My Reports Error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// ✅ ✅ ✅ SECTION: MARK REPORT AS REVIEWED (ADMIN ACTION)
export const markReportAsReviewed = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await ViolationReport.findByIdAndUpdate(
      id,
      { status: "Under Review" }, // Updated to 'Under Review'
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Report marked as reviewed by admin',
      report: updated,
    });
  } catch (error) {
    console.error('Mark Report Reviewed Error:', error);
    res.status(500).json({ message: 'Failed to mark report as reviewed' });
  }
};

// ✅ ✅ ✅ view report controller with an eye this is for the reporter only
export const getSingleReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reporterId = req.user._id;

    const report = await ViolationReport.findOne({ _id: id, reporterId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get Single Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};