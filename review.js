// review.js

const express = require("express");
const router = express.Router();
const wrapAsync = require("./utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("./middleware");
const listingController = require("./controllers/listings");
const multer = require("multer");
const { storage } = require("./cloudConfig");
const upload = multer({ storage });

// Define the routes
router
    .route("/")
    .get(wrapAsync(listingController.index)) // Get all listings (index)
    .post(
        isLoggedIn, // Middleware to ensure user is logged in
        upload.single("listing[image]"), // Handle single file upload
        validateListing, // Validate the listing data
        wrapAsync(listingController.createListing) // Controller function to create the listing
    );

module.exports = router;