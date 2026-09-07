const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary, useCloudinary } = require('../middleware/upload');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      neighborhood,
      isAvailable,
      isFeatured,
      sort = '-createdAt',
      search,
      amenities,
      petPolicy,
    } = req.query;

    const filter = {};

    if (type) filter.type = { $in: type.split(',') };
    if (bedrooms) filter.bedrooms = { $in: bedrooms.split(',').map(Number) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (neighborhood) filter.neighborhood = { $in: neighborhood.split(',') };
    if (minRent || maxRent) {
      filter.monthlyRent = {};
      if (minRent) filter.monthlyRent.$gte = Number(minRent);
      if (maxRent) filter.monthlyRent.$lte = Number(maxRent);
    }
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (isFeatured === 'true') filter.isFeatured = true;
    if (petPolicy === 'true') filter['petPolicy.allowed'] = true;
    if (amenities) {
      const amenityList = amenities.split(',');
      filter.amenities = { $all: amenityList };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, isAvailable: true })
      .sort('-createdAt')
      .limit(6)
      .lean();
    res.json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/neighborhoods', async (req, res) => {
  try {
    const neighborhoods = await Property.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$neighborhood',
          count: { $sum: 1 },
          minRent: { $min: '$monthlyRent' },
          maxRent: { $max: '$monthlyRent' },
          image: { $first: { $arrayElemAt: ['$images.url', 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: neighborhoods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.viewCount += 1;
    await property.save({ validateBeforeSave: false });

    const similar = await Property.find({
      _id: { $ne: property._id },
      type: property.type,
      isAvailable: true,
    })
      .limit(3)
      .lean();

    res.json({ success: true, data: property, similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, upload.array('images', 20), async (req, res) => {
  try {
    const images = (req.files || []).map((file, i) => ({
      url: useCloudinary ? file.path : `/uploads/${file.filename}`,
      publicId: useCloudinary ? file.filename : null,
      isPrimary: i === 0,
    }));

    const amenities = req.body.amenities
      ? typeof req.body.amenities === 'string'
        ? JSON.parse(req.body.amenities)
        : req.body.amenities
      : [];

    const buildingAmenities = req.body.buildingAmenities
      ? typeof req.body.buildingAmenities === 'string'
        ? JSON.parse(req.body.buildingAmenities)
        : req.body.buildingAmenities
      : [];

    const petPolicy = req.body.petPolicy
      ? typeof req.body.petPolicy === 'string'
        ? JSON.parse(req.body.petPolicy)
        : req.body.petPolicy
      : { allowed: false };

    const property = await Property.create({
      ...req.body,
      images,
      amenities,
      buildingAmenities,
      petPolicy,
    });

    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, upload.array('images', 20), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const newImages = (req.files || []).map((file, i) => ({
      url: useCloudinary ? file.path : `/uploads/${file.filename}`,
      publicId: useCloudinary ? file.filename : null,
      isPrimary: property.images.length === 0 && i === 0,
    }));

    const existingImages = req.body.existingImages
      ? typeof req.body.existingImages === 'string'
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages
      : property.images;

    const amenities = req.body.amenities
      ? typeof req.body.amenities === 'string'
        ? JSON.parse(req.body.amenities)
        : req.body.amenities
      : property.amenities;

    const buildingAmenities = req.body.buildingAmenities
      ? typeof req.body.buildingAmenities === 'string'
        ? JSON.parse(req.body.buildingAmenities)
        : req.body.buildingAmenities
      : property.buildingAmenities;

    const petPolicy = req.body.petPolicy
      ? typeof req.body.petPolicy === 'string'
        ? JSON.parse(req.body.petPolicy)
        : req.body.petPolicy
      : property.petPolicy;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: [...existingImages, ...newImages],
        amenities,
        buildingAmenities,
        petPolicy,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (useCloudinary && cloudinary) {
      for (const img of property.images) {
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
