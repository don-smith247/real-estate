const express = require('express');
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('type').isIn(['general', 'tour', 'pricing', 'availability', 'application']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { propertyId, ...rest } = req.body;
      const inquiryData = { ...rest, ipAddress: req.ip };

      if (propertyId) {
        const property = await Property.findById(propertyId);
        if (property) {
          inquiryData.property = propertyId;
          inquiryData.propertyTitle = property.title;
          property.inquiryCount += 1;
          await property.save({ validateBeforeSave: false });
        }
      }

      const inquiry = await Inquiry.create(inquiryData);
      res.status(201).json({ success: true, data: inquiry, message: 'Your inquiry has been sent. We will contact you shortly.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('property', 'title address')
      .lean();

    res.json({
      success: true,
      data: inquiries,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('property', 'title address images');
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    if (inquiry.status === 'new') {
      inquiry.status = 'read';
      await inquiry.save();
    }
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};
    if (status) {
      update.status = status;
      if (status === 'contacted' || status === 'resolved') {
        update.respondedAt = new Date();
        update.respondedBy = req.user._id;
      }
    }
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
