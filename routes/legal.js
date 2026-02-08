const express = require("express");
const router = express.Router();

router.get("/privacy-policy", (req, res) => {
  res.render("legal/privacy-policy");
});

router.get("/terms-of-service", (req, res) => {
  res.render("legal/terms-of-service");
});

module.exports = router;
