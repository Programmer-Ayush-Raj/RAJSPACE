const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

// GET /wishlist — show saved listings (session-based)
router.get("/", async (req, res) => {
  const ids = req.session.wishlist || [];
  const listings = ids.length
    ? await Listing.find({ _id: { $in: ids } }).limit(50)
    : [];
  res.render("wishlist/index.ejs", { listings });
});

// POST /wishlist/:id — add listing to wishlist (redirect back to that listing)
router.post("/:id", (req, res) => {
  req.session.wishlist = req.session.wishlist || [];
  const id = req.params.id;
  if (!req.session.wishlist.includes(id)) {
    req.session.wishlist.push(id);
  }
  req.flash("success", "Added to your wishlist!");
  res.redirect(`/listings/${id}`);
});

// DELETE /wishlist/:id — remove from wishlist (redirect to wishlist page)
router.delete("/:id", (req, res) => {
  req.session.wishlist = req.session.wishlist || [];
  req.session.wishlist = req.session.wishlist.filter((id) => id !== req.params.id);
  req.flash("success", "Removed from wishlist.");
  res.redirect("/wishlist");
});

module.exports = router;
