const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressLayouts = require('express-ejs-layouts'); // For layouts
const User = require('./models/user'); // Assuming you have the User model

// Route files
const listingsRoutes = require('./listing'); // listing.js
const reviewsRoutes = require('./review'); // review.js
const userRoutes = require('./user'); // user.js

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Initialize Express app
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts for layouts
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate'); // Set the default layout to 'boilerplate'

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method')); // For PUT and DELETE requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session and flash messages
app.use(session({
    secret: 'secretcode', // Change this to a secure key in production
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set local variables for flash messages and user info
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/listings', listingsRoutes); // Listings routes
app.use('/reviews', reviewsRoutes); // Reviews routes
app.use('/', userRoutes); // User routes (login, register, etc.)

// Root route
app.get('/', (req, res) => {
    res.render('home'); // Render home.ejs
});

// Start server
app.listen(3000, () => {
    console.log('Serving on port 3000');
});