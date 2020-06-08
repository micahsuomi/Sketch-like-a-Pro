const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/', (req, res) => {
    res.render('index')
})


//SHOW route for register form
router.get('/register', (req, res) => {
    res.render('register');
})

//POST route to handle the registration logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err)
            return res.render('register')
        } 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/galleries')
        })
    })
})

//LOGIN show to show the login form
router.get('/login', (req, res) => {
    res.render('login');
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
    res.redirect('/galleries');
});

module.exports = router;

