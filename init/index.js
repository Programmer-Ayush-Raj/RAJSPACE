const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/rajspace";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // Ensure seed user exists so every listing has a valid owner
  let seedUser = await User.findOne({ username: "rajspace-seed" });
  if (!seedUser) {
    const register = await User.register(new User({ email: "seed@rajspace.dev", username: "rajspace-seed" }), "seed-pass-123");
    seedUser = register;
    console.log("Seed user created: rajspace-seed");
  }
  const ownerId = seedUser._id;

  const defaultGeometry = {
    type: "Point",
    coordinates: [72.8777, 19.0760], // Mumbai
  };

  // Assign categories so filters (Mountain, Beach, etc.) show results
  const categories = [
    "Beach", "City", "Mountain", "Entire Home", "Nature", "Beach", "Nature", "City",
    "Mountain", "Nature", "City", "Luxury", "Entire Home", "City", "Beach", "Mountain",
    "City", "Pool", "Luxury", "Luxury", "Mountain", "Beach", "Nature", "Entire Home",
    "City", "Nature", "Luxury", "Mountain", "Beach",
  ];

  const listingsWithOwner = initData.data.map((obj, i) => ({
    ...obj,
    owner: ownerId,
    category: obj.category || categories[i] || "Trending",
    geometry: obj.geometry || defaultGeometry,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Data was initialized. Listings owner:", ownerId);
};

initDB();