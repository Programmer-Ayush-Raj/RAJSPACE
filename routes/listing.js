const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Use single image; optional so creation works even if Cloudinary upload fails (controller uses placeholder)
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));




// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Reserve / Request to book (must be before /:id)
router.get("/:id/reserve", wrapAsync(listingController.renderReservePage));

router.route("/:id")
.get(  wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
   wrapAsync(listingController.updateListing))
.delete(isLoggedIn,wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));


module.exports = router;