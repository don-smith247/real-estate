const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle: { type: String },
    applicationNumber: { type: String, unique: true },

    applicant: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      dateOfBirth: { type: Date, required: true },
      ssn: { type: String },
      idType: { type: String, enum: ['drivers_license', 'passport', 'state_id'] },
      idNumber: { type: String },
    },

    currentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      monthlyRent: { type: Number },
      durationMonths: { type: Number },
      reasonForLeaving: { type: String },
    },

    employment: {
      employerName: { type: String, required: true },
      position: { type: String, required: true },
      monthlyIncome: { type: Number, required: true },
      startDate: { type: Date },
      supervisorName: { type: String },
      supervisorPhone: { type: String },
      employmentType: { type: String, enum: ['full_time', 'part_time', 'self_employed', 'retired', 'student'] },
    },

    previousLandlord: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      address: { type: String },
    },

    references: [
      {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        relationship: { type: String },
      },
    ],

    pets: {
      hasPets: { type: Boolean, default: false },
      description: { type: String },
    },

    vehicles: [
      {
        make: { type: String },
        model: { type: String },
        year: { type: Number },
        color: { type: String },
        licensePlate: { type: String },
      },
    ],

    occupants: { type: Number, default: 1 },
    smokingStatus: { type: Boolean, default: false },

    moveInDate: { type: Date, required: true },
    leaseTerm: { type: Number, default: 12 },

    additionalInfo: { type: String },

    agreeToTerms: { type: Boolean, required: true, default: false },
    backgroundCheckConsent: { type: Boolean, default: false },
    creditCheckConsent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'denied', 'withdrawn'],
      default: 'pending',
    },
    adminNotes: { type: String },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    applicationFee: { type: Number, default: 50 },
    feePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applicationSchema.pre('save', function (next) {
  if (!this.applicationNumber) {
    this.applicationNumber = 'APP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
