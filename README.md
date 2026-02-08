# RAJSPACE

<p align="center">
  <img src="https://via.placeholder.com/120x120/0d9488/ffffff?text=RS" alt="RAJSPACE Logo" width="120" height="120">
</p>

<p align="center">
  <img src="https://via.placeholder.com/800x280/0d9488/ffffff?text=RAJSPACE+%E2%80%94+Stays+%26+Experiences" alt="RAJSPACE Banner" width="800" height="280">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/EJS-Templates-A91B0D?style=flat-square" alt="EJS">
  <img src="https://img.shields.io/badge/Passport-Auth-34E0A1?style=flat-square" alt="Passport">
  <img src="https://img.shields.io/badge/Status-Production--Ready-0d9488?style=flat-square" alt="Status">
</p>

---

## About

**RAJSPACE** is a full-stack stays and experiences platform. Discover unique listings, save favorites to your wishlist, list your own space, and leave reviews. Built with **Express**, **MongoDB**, and **EJS** using an **MVC** architecture for clean, maintainable code.

---

## Features

| Feature | Description |
|--------|-------------|
| **Explore & filter** | Browse stays by category (Beach, Mountain, City, Luxury, Nature, etc.) and search by location or keyword. |
| **Wishlist** | Save listings to your wishlist (session-based) and manage them from one place. |
| **Host badge** | Listings show a **RAJSPACE Verified Host** badge for trusted hosts. |
| **Review analytics** | Listing pages display average rating and total review count at a glance. |
| **Interactive maps** | Mapbox-powered maps show where each stay is located. |
| **Image uploads** | Cloudinary integration for listing images. |
| **Auth** | Sign up, log in, and log out with Passport.js (local strategy). |
| **Full CRUD** | Create, read, update, and delete your own listings. |
| **Reviews** | Authenticated users can leave star ratings and comments; authors can delete their own reviews. |
| **Responsive UI** | Bootstrap 5 and custom teal-themed CSS for a consistent look on all devices. |

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Runtime** | Node.js 24 |
| **Backend** | Express 5, Mongoose, Passport (local), express-session, connect-mongo |
| **Database** | MongoDB |
| **Frontend** | EJS (ejs-mate), Bootstrap 5, custom CSS, Font Awesome |
| **Validation** | Joi (listing & review schemas) |
| **File upload** | Multer, multer-storage-cloudinary |
| **Maps** | Mapbox Geocoding + Mapbox GL JS |
| **Env** | dotenv |

---

## Folder Structure

```
├── app.js                 # Entry point, Express app, middleware, routes
├── cloudConfig.js         # Cloudinary config for uploads
├── middleware.js         # isLoggedIn, isOwner, validateListing, validateReview, etc.
├── schema.js             # Joi validation schemas
├── package.json
├── .env                   # MAP_TOKEN, ATLASDB_URL, SECRET, CLOUDINARY_* (see below)
├── controllers/
│   ├── listings.js       # Listing CRUD, show with populate & reviewStats
│   ├── reviews.js        # Create/delete reviews
│   └── users.js          # Signup, login, logout
├── init/
│   ├── index.js          # Seed script (creates seed user + listings)
│   └── data.js           # Sample listing data
├── models/
│   ├── listing.js        # Listing schema (owner ref User, reviews ref Review)
│   ├── review.js         # Review schema (author ref User)
│   └── user.js           # User schema (passport-local-mongoose)
├── routes/
│   ├── listing.js        # /listings CRUD + new, edit
│   ├── review.js         # /listings/:id/reviews
│   ├── user.js           # /signup, /login, /logout
│   └── wishlist.js       # /wishlist GET/POST/DELETE
├── utils/
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async route wrapper
├── public/
│   ├── css/              # style.css, rating.css
│   └── js/               # script.js, map.js
├── views/
│   ├── layouts/          # boilerplate.ejs
│   ├── includes/         # navbar, footer, flash
│   ├── listings/         # index, show, new, edit
│   ├── users/            # login, signup
│   ├── wishlist/         # index
│   └── error.ejs
└── screenshots/          # Placeholder or real screenshots
```

---

## Environment Setup

Create a `.env` in the project root with:

| Variable | Description |
|----------|-------------|
| `ATLASDB_URL` | MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/rajspace`) |
| `SECRET` | Session secret (any long random string) |
| `MAP_TOKEN` | Mapbox public access token |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

For local dev without Cloudinary, ensure upload handling doesn’t assume Cloudinary (or use a test cloud).

---

## Installation

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd rajspace
   npm install
   ```

2. **Configure environment**

   Copy or create `.env` with the variables above.

3. **Start MongoDB** (local or Atlas)

   Ensure MongoDB is running and `ATLASDB_URL` points to it.

4. **Seed database (optional)**

   ```bash
   npm run seed
   ```

   This creates a user `rajspace-seed` (password: `seed-pass-123`) and populates sample listings with that user as owner.

5. **Run the app**

   ```bash
   npm start
   ```

   Server runs at `http://localhost:8080`. Root `/` redirects to `/listings`.

---

## Database Setup

- **MongoDB** is used for users, listings, and reviews.
- **Listings** have required `owner` (ref: User); seed script ensures a seed user exists before inserting listings.
- **Reviews** reference User (`author`) and are embedded in listing flow via populate.
- Run `node init/index.js` (or `npm run seed`) to reset and seed with sample data.

---

## Screenshots

| Explore / Home | Listing detail (host badge, reviews, wishlist) |
|:---:|:---:|
| ![Explore](https://via.placeholder.com/600x360/0d9488/ffffff?text=Explore+Listings) | ![Listing](https://via.placeholder.com/600x360/0f766e/ffffff?text=Listing+Detail) |

| Wishlist | Auth |
|:---:|:---:|
| ![Wishlist](https://via.placeholder.com/600x360/ccfbf1/0f766e?text=Wishlist) | ![Login](https://via.placeholder.com/600x360/0d9488/ffffff?text=Login+%2F+Signup) |

*(Replace with real screenshots from `screenshots/` when available.)*

---

## API / Routes Table

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Redirect to `/listings` |
| GET | `/listings` | List all listings (optional `?category=&q=`) |
| GET | `/listings/new` | New listing form (auth required) |
| POST | `/listings` | Create listing (auth, validate, upload) |
| GET | `/listings/:id` | Listing detail (owner & reviews populated) |
| GET | `/listings/:id/edit` | Edit form (auth, owner only) |
| PUT | `/listings/:id` | Update listing (auth, owner, validate, optional upload) |
| DELETE | `/listings/:id` | Delete listing (auth) |
| POST | `/listings/:id/reviews` | Create review (auth, validate) |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review (auth, author only) |
| GET | `/wishlist` | Wishlist page (session-based) |
| POST | `/wishlist/:id` | Add listing to wishlist |
| DELETE | `/wishlist/:id` | Remove from wishlist |
| GET | `/signup` | Signup form |
| POST | `/signup` | Register user |
| GET | `/login` | Login form |
| POST | `/login` | Login (Passport local) |
| GET | `/logout` | Logout |

---

## Future Roadmap

- [ ] **Payments** — Integrate Stripe or Razorpay for reservations.
- [ ] **Persistent wishlist** — Store wishlist in DB per user.
- [ ] **Host badge levels** — Superhost / verified tiers based on reviews and response time.
- [ ] **Admin panel** — Moderate users and listings.
- [ ] **Booking calendar** — Availability and date-based booking.
- [ ] **Email** — Notifications and password reset.

---

## License

ISC

---

## Author

**RAJ**

- RAJSPACE — Stays & Experiences
- Project refactored and extended from a learning base to a production-style codebase (MVC, validation, null-safe owner/reviews, wishlist, host badge, review analytics).
