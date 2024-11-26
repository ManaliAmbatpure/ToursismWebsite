// middleware.js

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isOwner = (req, res, next) => {
    if (!req.user || req.user._id !== req.params.id) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect('/listings');
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        req.flash('error', 'Name and price are required!');
        return res.redirect('/listings/new');
    }
    next();
};