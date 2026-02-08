const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

module.exports.index = async (req, res) => {
  const { category, q } = req.query;

  let query = {};

  // Category filter
  if (category) {
    query.category = category;
  }

  // Search filter
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings, q, category });
};



module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.renderReservePage = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  if (!listing.owner) {
    listing.owner = { _id: null, username: "RAJSPACE Host" };
  }
  res.render("listings/reserve.ejs", { listing });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  // Null-safe: ensure owner is always an object for the view (e.g. orphaned ref or old seed data)
  if (!listing.owner) {
    listing.owner = { _id: null, username: "RAJSPACE Host" };
  }
  // Review analytics for the view
  const reviews = listing.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
    : null;
  const reviewStats = { count: reviewCount, average: avgRating };
  res.render("listings/show.ejs", { listing, reviewStats });
};


const DEFAULT_GEOMETRY = { type: "Point", coordinates: [72.8777, 19.076] };

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Image: use uploaded file or placeholder when Cloudinary is not configured / upload fails
    if (req.file && req.file.path) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    } else {
      newListing.image = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
        filename: "placeholder",
      };
    }

    // Geocoding: use Mapbox when available, else default
    if (mapToken && req.body.listing.location) {
      try {
        const response = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        }).send();
        if (response.body.features && response.body.features[0]) {
          newListing.geometry = response.body.features[0].geometry;
        } else {
          newListing.geometry = DEFAULT_GEOMETRY;
        }
      } catch (err) {
        newListing.geometry = DEFAULT_GEOMETRY;
      }
    } else {
      newListing.geometry = DEFAULT_GEOMETRY;
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    return res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message || "Could not create listing. Check all required fields.");
    return res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/ w_250")
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // 1. Find listing first
  let listing = await Listing.findById(id);

  // 2. Update basic fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;
  listing.category = req.body.listing.category;

  // 3. 🔥 Re-geocode if location changed
  if (req.body.listing.location) {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    listing.geometry = response.body.features[0].geometry;
  }

  // 4. Image update (if new image uploaded)
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  // 5. Save everything
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
