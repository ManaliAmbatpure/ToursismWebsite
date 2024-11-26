const express = require('express');
const router = express.Router();
const Listing = require('./models/listing');
const { isLoggedIn, isOwner } = require('./middleware');

// Render Create Listing page
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
});

// Handle Create Listing
router.post('/', isLoggedIn, async(req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect(`/listings/${listing._id}`);
});

// Render Edit Listing page
router.get('/:id/edit', isLoggedIn, isOwner, async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit', { listing });
});

// Handle Update Listing
router.put('/:id', isLoggedIn, isOwner, async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
});

// Handle Delete Listing
router.delete('/:id', isLoggedIn, isOwner, async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
});

module.exports = router;