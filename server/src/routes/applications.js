const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('applicant.firstName').notEmpty().withMessage('First name required'),
    body('applicant.lastName').notEmpty().withMessage('Last name required'),
    body('applicant.email').isEmail().withMessage('Valid email required'),
    body('applicant.phone').notEmpty().withMessage('Phone required'),
    body('applicant.dateOfBirth').notEmpty().withMessage('Date of birth required'),
    body('employment.employerName').notEmpty().withMessage('Employer name required'),
    body('employment.monthlyIncome').isNumeric().withMessage('Monthly income required'),
    body('moveInDate').notEmpty().withMessage('Move-in date required'),
    body('agreeToTerms').equals('true').withMessage('Must agree to terms'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { propertyId, ...rest } = req.body;
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      const application = await Application.create({
        ...rest,
        property: propertyId,
        propertyTitle: property.title,
        applicationFee: property.applicationFee || 50,
      });

      res.status(201).json({
        success: true,
        data: application,
        message: `Application submitted successfully. Your application number is ${application.applicationNumber}.`,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { 'applicant.firstName': { $regex: search, $options: 'i' } },
        { 'applicant.lastName': { $regex: search, $options: 'i' } },
        { 'applicant.email': { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { propertyTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('property', 'title address monthlyRent')
      .lean();

    res.json({
      success: true,
      data: applications,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('property', 'title address monthlyRent images');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
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
      if (['approved', 'denied', 'under_review'].includes(status)) {
        update.reviewedAt = new Date();
        update.reviewedBy = req.user._id;
      }
    }
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const application = await Application.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
