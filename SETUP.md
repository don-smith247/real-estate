# Arcadia — Premium Real Estate Rental Platform

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arcadia
JWT_SECRET=change_this_to_a_random_string
ADMIN_EMAIL=admin@arcadia.com
ADMIN_PASSWORD=Admin@123!
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database
```bash
npm run seed
```
This creates the admin user and 6 sample luxury properties.

### 4. Run in Development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Admin Panel
Visit: http://localhost:5173/admin/login
- Email: `admin@arcadia.com`
- Password: `Admin@123!`

---

## Image Uploads
By default, images are stored locally in `server/uploads/`.

To use Cloudinary (recommended for production), add to `server/.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Production Build
```bash
npm run build    # builds React app to client/dist
npm run start    # starts Express server (also serves the built frontend)
```

## Tech Stack
- **Frontend**: React 18 + Vite, Framer Motion, Lucide React, React Hook Form
- **Backend**: Express.js, Mongoose (MongoDB), JWT Auth, Multer/Cloudinary
- **PWA**: Vite Plugin PWA, Workbox (service worker + offline caching)
- **Fonts**: Cormorant Garamond (display) + Inter (body)
- **Design**: Custom CSS with CSS variables, no UI library

## Features
### Public Site
- Hero with animated background slideshow and search
- Featured properties with Framer Motion entrance animations  
- Neighborhood explorer
- Amenities section
- Testimonials carousel
- How It Works steps
- CTA section
- Property listings with advanced filters (type, price, beds, pets)
- Grid/List view toggle
- Property detail with full image gallery/lightbox
- Inquiry form (schedule tour, general, pricing)
- Multi-step rental application form
- About page with team, values, FAQ
- Contact page
- PWA (installable, offline support)

### Admin Panel
- Auth-protected dashboard
- Stats overview (properties, inquiries, applications)
- Property CRUD with image upload (Cloudinary or local)
- Amenity picker UI
- Inquiry management with status workflow
- Application management with approve/deny workflow
- Admin notes on inquiries and applications
- Responsive sidebar navigation
