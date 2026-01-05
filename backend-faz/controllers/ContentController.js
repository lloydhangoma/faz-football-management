import Content from '../models/Content.js';
import cloudinary from '../config/cloudinary.js';
import { PassThrough } from 'stream';

const uploadBuffer = (buffer, folder) => new Promise((resolve, reject) => {
  try {
    const opts = { folder, resource_type: 'image' };
    const stream = cloudinary.uploader.upload_stream(opts, (err, result) => (err ? reject(err) : resolve(result)));
    const pass = new PassThrough();
    pass.end(buffer);
    pass.pipe(stream);
  } catch (err) {
    reject(err);
  }
});

export const listContent = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const items = await Content.find(q).sort({ publishedAt: -1, createdAt: -1 });
    return res.status(200).json({ ok: true, items });
  } catch (err) {
    console.error('listContent error:', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Failed to list content' });
  }
};

export const getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Content.findById(id);
    if (!item) return res.status(404).json({ ok: false, message: 'Not found' });
    return res.status(200).json({ ok: true, item });
  } catch (err) {
    console.error('getContent error:', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Failed to get content' });
  }
};

export const createContent = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ ok: false, message: 'Title is required' });
    if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();

    const created = await Content.create(payload);
    return res.status(201).json({ ok: true, item: created });
  } catch (err) {
    console.error('createContent error:', err);
    return res.status(400).json({ ok: false, message: err?.message || 'Failed to create content' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    const updated = await Content.findByIdAndUpdate(id, payload, { new: true });
    return res.status(200).json({ ok: true, item: updated });
  } catch (err) {
    console.error('updateContent error:', err);
    return res.status(400).json({ ok: false, message: err?.message || 'Failed to update content' });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndDelete(id);
    return res.status(200).json({ ok: true, message: 'Deleted' });
  } catch (err) {
    console.error('deleteContent error:', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Failed to delete' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded' });
    const folder = process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/content` : 'faz/content';
    const result = await uploadBuffer(req.file.buffer, folder);
    return res.status(200).json({ ok: true, url: result.secure_url, result });
  } catch (err) {
    console.error('uploadImage error:', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Failed to upload image' });
  }
};
