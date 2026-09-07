const express = require('express');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Application = require('../models/Application');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalProperties,
      availableProperties,
      featuredProperties,
      totalInquiries,
      newInquiries,
      totalApplications,
      pendingApplications,
      approvedApplications,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ isAvailable: true }),
      Property.countDocuments({ isFeatured: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
    ]);

    const recentInquiries = await Inquiry.find()
      .sort('-createdAt')
      .limit(5)
      .populate('property', 'title')
      .lean();

    const recentApplications = await Application.find()
      .sort('-createdAt')
      .limit(5)
      .populate('property', 'title')
      .lean();

    const propertiesByType = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const monthlyStats = await Application.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        properties: { total: totalProperties, available: availableProperties, featured: featuredProperties, byType: propertiesByType },
        inquiries: { total: totalInquiries, new: newInquiries },
        applications: { total: totalApplications, pending: pendingApplications, approved: approvedApplications },
        recentInquiries,
        recentApplications,
        monthlyStats,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── Site Settings ── */
router.get('/public-settings', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ── Users ── */
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/users', protect, adminOnly, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only superadmins can create users' });
    }
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user.toJSON() });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
