import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  summary: String,
  body: String,
  author: String,
  tags: [String],
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishedAt: Date,
  featuredImage: String,
}, { timestamps: true });

const Content = mongoose.model('Content', ContentSchema);
export default Content;
