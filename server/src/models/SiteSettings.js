const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  contactPhone:    { type: String, default: '(202) 555-0180' },
  contactEmail:    { type: String, default: 'hello@rotexonerealty.com' },
  officeAddress:   { type: String, default: '1600 K Street NW' },
  officeCity:      { type: String, default: 'Washington, DC 20006' },
  officeHours:     { type: String, default: 'Mon–Fri: 9am–6pm · Sat: 10am–4pm' },
  instagramUrl:    { type: String, default: '#' },
  facebookUrl:     { type: String, default: '#' },
  linkedinUrl:     { type: String, default: '#' },
  instagramHandle: { type: String, default: '@rotexonerealty' },
  facebookHandle:  { type: String, default: 'Rotex One Realty' },
  linkedinHandle:  { type: String, default: 'Rotex One Realty' },
  companyTagline:  { type: String, default: "Washington DC's premier rental service. Fifteen years of expertise, integrity, and results." },
  heroHeadline:    { type: String, default: 'Live Where Excellence Is The Standard' },
  heroSubtitle:    { type: String, default: 'Rotex One Realty brings decades of expertise to connecting discerning clients with Washington\'s most coveted rental residences.' },
  aboutHeadline:   { type: String, default: 'Redefining What Renting Should Feel Like' },
  aboutBody:       { type: String, default: 'Rotex One Realty was founded on a conviction that the rental experience should match the quality of the residence itself. For fifteen years, we have served Washington\'s most discerning clients with the expertise, integrity, and personal attention that the nation\'s capital demands.' },
}, { timestamps: true });

siteSettingsSchema.statics.getSettings = async function () {
  let s = await this.findOne();
  if (!s) s = await this.create({});
  return s;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
