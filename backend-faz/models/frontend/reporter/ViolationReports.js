// 📁 File: models/frontend/reporter/ViolationReports.js

import mongoose from 'mongoose';

const violationReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReporterUser', required: true },
  title: { type: String, required: true },
  violationType: { type: String, required: true },
  description: { type: String, required: true },
  perpetrator: { type: String },
  victim: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  datetime: { type: Date, required: true },
  visibility: { type: String, required: true },
  consent1: { type: Boolean, required: true },
  consent2: { type: Boolean, required: true },
  files: [
    {
      storage: { type: String },
      url: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      buffer: { type: Buffer },
    },
  ],
  status: { type: String, enum: ['Pending', 'Under Review', 'Resolved', 'In Progress', 'Rejected', 'Suspended'], default: 'Pending' }, // Updated enum
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }, // Optional, based on usage
}, { timestamps: true });

const ViolationReport = mongoose.model('ViolationReport', violationReportSchema);
export default ViolationReport;