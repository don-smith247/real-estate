const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['studio', '1br', '2br', '3br', 'penthouse', 'townhouse', 'loft'],
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 1 },
    sqft: { type: Number, required: true },
    floor: { type: Number },
    totalFloors: { type: Number },

    address: {
      street: { type: String, required: true },
      unit: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    neighborhood: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    monthlyRent: { type: Number, required: true },
    deposit: { type: Number },
    applicationFee: { type: Number, default: 50 },
    utilitiesIncluded: { type: [String], default: [] },

    availableDate: { type: Date, required: true },
    leaseTerm: { type: Number, default: 12 },
    isAvailable: { type: Boolean, default: true },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    virtualTourUrl: { type: String },
    floorPlanUrl: { type: String },

    amenities: { type: [String], default: [] },
    buildingAmenities: { type: [String], default: [] },

    petPolicy: {
      allowed: { type: Boolean, default: false },
      types: { type: [String], default: [] },
      deposit: { type: Number },
      monthlyFee: { type: Number },
      restrictions: { type: String },
    },

    parkingAvailable: { type: Boolean, default: false },
    parkingFee: { type: Number },
    storageAvailable: { type: Boolean, default: false },

    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },

    viewCount: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') +
      '-' +
      Date.now();
  }
  next();
});

propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ neighborhood: 1 });
propertySchema.index({ isAvailable: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ type: 1 });

module.exports = mongoose.model('Property', propertySchema);
