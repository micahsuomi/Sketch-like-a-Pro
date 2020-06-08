const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Gallery = require('../models/gallery');

const passport = require('passport');


router.get('/', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('index', {gallery})
    })
})


//SHOW route for register form
router.get('/register', (req, res) => {
    res.render('register');
})

//POST route to handle the registration logic
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        image: '',
        city: '',
        country: ''

    })
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message);
            res.redirect('back');
        } 
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to Sketch Like a Pro ${newUser.username}`)
            res.redirect('/galleries');
        })
    })
})

//LOGIN show to show the login form
router.get('/login', (req, res) => {
    res.render('login', req.flash('Please login first'));
})

//LOGIN logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/galleries',
    failureRedirect: '/login'
}), (req, res) => {
});

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error', 'You are logged out')
    res.redirect('/galleries');
});

module.exports = router;

