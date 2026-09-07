require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Property = require('./models/Property');

const IMG = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&h=900&q=80`;

const PROPERTIES = [
  {
    title: 'The Meridian Penthouse',
    description:
      'Experience unparalleled luxury in this stunning penthouse with panoramic city views. Floor-to-ceiling windows, custom millwork, and designer finishes create an ambiance of sophisticated elegance. The gourmet kitchen features Wolf and Sub-Zero appliances, Calacatta marble countertops, and custom cabinetry. The primary suite is a private sanctuary with a spa-like bath and walk-in closet.',
    type: 'penthouse',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    floor: 42,
    totalFloors: 42,
    address: { street: '1100 Connecticut Ave NW', unit: 'PH-42', city: 'Washington', state: 'DC', zip: '20036' },
    neighborhood: 'Dupont Circle',
    coordinates: { lat: 38.9099, lng: -77.0425 },
    monthlyRent: 8500,
    deposit: 17000,
    applicationFee: 75,
    availableDate: new Date('2025-11-01'),
    leaseTerm: 12,
    isFeatured: true,
    isAvailable: true,
    amenities: ['Private Terrace', 'Smart Home System', 'Radiant Floor Heating', 'Custom Closets', 'In-Unit Washer/Dryer', 'Chef\'s Kitchen', 'Wine Cooler', 'City Views'],
    buildingAmenities: ['24/7 Concierge', 'Rooftop Pool & Lounge', 'Fitness Center', 'Business Center', 'Valet Parking', 'Dry Cleaning Service', 'Package Receiving', 'Electric Vehicle Charging'],
    petPolicy: { allowed: true, types: ['dogs', 'cats'], deposit: 500, monthlyFee: 75, restrictions: 'Max 2 pets, 50 lbs each' },
    parkingAvailable: true,
    parkingFee: 250,
    tags: ['luxury', 'views', 'penthouse', 'new'],
    images: [
      { url: IMG('1560448204-e02f11c3d0e2'), isPrimary: true },
      { url: IMG('1556909114-f6e7ad7d3136'), isPrimary: false },
      { url: IMG('1522708323590-d24dbb6b0267'), isPrimary: false },
      { url: IMG('1512917774080-9991f1c4c750'), isPrimary: false },
    ],
  },
  {
    title: 'The Hamilton — Two Bedroom',
    description:
      'A meticulously designed two-bedroom residence in the heart of Capitol Hill. The open-plan living area flows seamlessly to a private balcony overlooking a tree-lined street. Exposed brick walls and original hardwood floors nod to the building\'s historic character while modern amenities ensure contemporary comfort.',
    type: '2br',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    floor: 4,
    totalFloors: 8,
    address: { street: '420 Capitol St SE', unit: '4B', city: 'Washington', state: 'DC', zip: '20003' },
    neighborhood: 'Capitol Hill',
    coordinates: { lat: 38.8869, lng: -76.9961 },
    monthlyRent: 3800,
    deposit: 3800,
    applicationFee: 50,
    availableDate: new Date('2025-10-15'),
    leaseTerm: 12,
    isFeatured: true,
    isAvailable: true,
    amenities: ['Private Balcony', 'Exposed Brick', 'Hardwood Floors', 'In-Unit Washer/Dryer', 'Stainless Appliances', 'Quartz Countertops', 'Walk-In Closet', 'Central A/C'],
    buildingAmenities: ['Rooftop Deck', 'Bike Storage', 'Package Room', 'Secure Entry', 'Elevator', 'Courtyard'],
    petPolicy: { allowed: true, types: ['cats', 'small dogs'], deposit: 300, monthlyFee: 50, restrictions: 'Max 1 pet, 25 lbs' },
    parkingAvailable: false,
    tags: ['historic', 'charming', 'balcony'],
    images: [
      { url: IMG('1567767291278-bd3afe8b7e71'), isPrimary: true },
      { url: IMG('1507089947-abce9a6e9040'), isPrimary: false },
      { url: IMG('1540518614846-7eded433c457'), isPrimary: false },
      { url: IMG('1484154218962-a197022b5858'), isPrimary: false },
    ],
  },
  {
    title: 'Rosewood Studio — Logan Circle',
    description:
      'An artfully designed studio in the coveted Logan Circle neighborhood. High ceilings, oversized windows, and thoughtful built-ins maximize every square foot. The efficient galley kitchen features premium appliances and ample storage. Steps from the best restaurants, galleries, and boutiques DC has to offer.',
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    floor: 2,
    totalFloors: 5,
    address: { street: '1330 P St NW', unit: '2A', city: 'Washington', state: 'DC', zip: '20005' },
    neighborhood: 'Logan Circle',
    coordinates: { lat: 38.9103, lng: -77.0314 },
    monthlyRent: 2100,
    deposit: 2100,
    applicationFee: 50,
    availableDate: new Date('2025-10-01'),
    leaseTerm: 12,
    isFeatured: false,
    isAvailable: true,
    amenities: ['High Ceilings', 'Oversized Windows', 'Built-In Storage', 'Hardwood Floors', 'Stainless Appliances', 'Central A/C'],
    buildingAmenities: ['Common Laundry', 'Secure Entry', 'Bike Storage', 'Package Room'],
    petPolicy: { allowed: true, types: ['cats'], deposit: 250, monthlyFee: 40, restrictions: 'Cats only, max 1' },
    parkingAvailable: false,
    tags: ['modern', 'walkable', 'vibrant'],
    images: [
      { url: IMG('1554995207-c18c203602cb'), isPrimary: true },
      { url: IMG('1556909211-36987daf7b4d'), isPrimary: false },
      { url: IMG('1552321554-5fefe8c9ef14'), isPrimary: false },
    ],
  },
  {
    title: 'Georgetown Loft — One Bedroom',
    description:
      'A stunning industrial loft in historic Georgetown featuring soaring 14-foot ceilings, exposed steel beams, and polished concrete floors. The open concept design is bathed in natural light from south-facing floor-to-ceiling windows. The chef\'s kitchen anchors the great room, perfect for entertaining.',
    type: 'loft',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    floor: 3,
    totalFloors: 4,
    address: { street: '3050 K St NW', unit: '3C', city: 'Washington', state: 'DC', zip: '20007' },
    neighborhood: 'Georgetown',
    coordinates: { lat: 38.9023, lng: -77.0596 },
    monthlyRent: 3200,
    deposit: 3200,
    applicationFee: 50,
    availableDate: new Date('2025-11-15'),
    leaseTerm: 12,
    isFeatured: true,
    isAvailable: true,
    amenities: ['14ft Ceilings', 'Exposed Beams', 'Polished Concrete', 'Chef\'s Kitchen', 'In-Unit W/D', 'Smart Home', 'Custom Lighting'],
    buildingAmenities: ['Fitness Center', 'Concierge', 'Rooftop Access', 'Parking Garage', 'Secure Entry'],
    petPolicy: { allowed: true, types: ['cats', 'dogs'], deposit: 350, monthlyFee: 60 },
    parkingAvailable: true,
    parkingFee: 200,
    tags: ['loft', 'industrial', 'designer', 'georgetown'],
    images: [
      { url: IMG('1524758631624-e2822132f776'), isPrimary: true },
      { url: IMG('1556742049-0cfed4f6a45d'), isPrimary: false },
      { url: IMG('1502005229762-56e87b73f7b3'), isPrimary: false },
    ],
  },
  {
    title: 'The Westbrook — Three Bedroom',
    description:
      'A palatial three-bedroom residence offering an unmatched living experience in Adams Morgan. The expansive floor plan includes a formal dining room, sun-drenched living room, and a private terrace. Each bedroom suite is designed as a personal retreat with generous closets and spa-caliber bathrooms.',
    type: '3br',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    floor: 6,
    totalFloors: 10,
    address: { street: '1800 Columbia Rd NW', unit: '6D', city: 'Washington', state: 'DC', zip: '20009' },
    neighborhood: 'Adams Morgan',
    coordinates: { lat: 38.9215, lng: -77.0439 },
    monthlyRent: 5200,
    deposit: 5200,
    applicationFee: 75,
    availableDate: new Date('2025-12-01'),
    leaseTerm: 12,
    isFeatured: true,
    isAvailable: true,
    amenities: ['Private Terrace', 'Formal Dining Room', 'In-Unit W/D', 'Chef\'s Kitchen', 'Walk-In Closets', 'Smart Home', 'Central A/C', 'Storage Unit'],
    buildingAmenities: ['24/7 Doorman', 'Rooftop Terrace', 'Resident Lounge', 'Fitness Center', 'Bike Storage', 'Package Room', 'Electric Car Charging'],
    petPolicy: { allowed: true, types: ['dogs', 'cats'], deposit: 500, monthlyFee: 75 },
    parkingAvailable: true,
    parkingFee: 175,
    tags: ['spacious', 'family', 'luxury', 'terrace'],
    images: [
      { url: IMG('1555041469-be6c8ecdda9c'), isPrimary: true },
      { url: IMG('1617103996702-96ff29b1c467'), isPrimary: false },
      { url: IMG('1505693314120-0d443867891c'), isPrimary: false },
      { url: IMG('1574362848149-11496d93a7c7'), isPrimary: false },
    ],
  },
  {
    title: 'Shaw Residence — One Bedroom',
    description:
      'A beautifully appointed one-bedroom in the vibrant Shaw neighborhood, recently renovated with designer touches throughout. The sun-filled open plan features new hardwood floors, custom kitchen with quartz countertops, and a spa-inspired bathroom. Walk to dozens of acclaimed restaurants, coffee shops, and cultural destinations.',
    type: '1br',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    floor: 3,
    totalFloors: 6,
    address: { street: '900 U St NW', unit: '3F', city: 'Washington', state: 'DC', zip: '20001' },
    neighborhood: 'Shaw',
    coordinates: { lat: 38.9181, lng: -77.0234 },
    monthlyRent: 2650,
    deposit: 2650,
    applicationFee: 50,
    availableDate: new Date('2025-10-01'),
    leaseTerm: 12,
    isFeatured: false,
    isAvailable: true,
    amenities: ['Hardwood Floors', 'Quartz Countertops', 'Stainless Appliances', 'In-Unit W/D', 'Central A/C', 'City Views'],
    buildingAmenities: ['Rooftop Deck', 'Bike Storage', 'Secure Entry', 'Package Room'],
    petPolicy: { allowed: true, types: ['cats'], deposit: 250, monthlyFee: 35 },
    parkingAvailable: false,
    tags: ['renovated', 'walkable', 'urban'],
    images: [
      { url: IMG('1502672260266-1c1ef2d93688'), isPrimary: true },
      { url: IMG('1556909172-8c2f041fca1e'), isPrimary: false },
      { url: IMG('1570129477492-cabc6fe9f0e8'), isPrimary: false },
    ],
  },
];

async function seed() {
  try {
    await connectDB();
    await User.deleteMany({});
    await Property.deleteMany({});

    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@arcadia.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123!',
      role: 'superadmin',
    });

    const properties = [];
    for (const p of PROPERTIES) {
      properties.push(await Property.create(p));
    }

    console.log(`\nSeeded successfully:`);
    console.log(`  Admin: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123!'}`);
    console.log(`  Properties: ${properties.length}`);
    console.log(`\nReady to run!\n`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
