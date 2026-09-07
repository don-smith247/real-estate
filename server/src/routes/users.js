const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

const router = express.Router();

/* ── Get profile ── */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedProperties', '_id title images monthlyRent neighborhood type bedrooms bathrooms sqft isAvailable availableDate slug');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── Update profile ── */
router.patch(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    try {
      const { name, email, phone, bio } = req.body;
      if (email && email !== req.user.email) {
        const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (phone !== undefined) updates.phone = phone;
      if (bio !== undefined) updates.bio = bio;

      const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
        .populate('savedProperties', '_id title images monthlyRent neighborhood type bedrooms bathrooms sqft isAvailable availableDate slug');
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ── Get saved properties ── */
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedProperties', '_id title images monthlyRent neighborhood type bedrooms bathrooms sqft isAvailable availableDate slug');
    res.json({ success: true, data: user.savedProperties || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── Save a property ── */
router.post('/saved/:propertyId', protect, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedProperties: propertyId },
    });
    res.json({ success: true, message: 'Property saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── Unsave a property ── */
router.delete('/saved/:propertyId', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedProperties: req.params.propertyId },
    });
    res.json({ success: true, message: 'Property removed from saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
