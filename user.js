const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('./models/user');

// Render login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle login logic
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.redirectUrl || '/';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
});

// Logout route
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});

module.exports = router;