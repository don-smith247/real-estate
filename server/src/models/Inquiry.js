const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    propertyTitle: { type: String },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    type: {
      type: String,
      required: true,
      enum: ['general', 'tour', 'pricing', 'availability', 'application'],
      default: 'general',
    },
    message: { type: String, required: true, trim: true },

    preferredDate: { type: Date },
    preferredTime: { type: String },

    moveInDate: { type: Date },
    budget: { type: Number },

    status: {
      type: String,
      enum: ['new', 'read', 'contacted', 'resolved', 'archived'],
      default: 'new',
    },
    adminNotes: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    source: { type: String, default: 'website' },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
