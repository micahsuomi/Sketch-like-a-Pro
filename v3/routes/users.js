const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//Register module
router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Plese fill in all fields' });

    }

    //check password match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0) {
        console.log(errors)
        res.render('register', {
            errors,
            name, 
            email,
            password,
            password2

        })
    } else {
        //validation passes
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                //user exists
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    name, 
                    email,
                    password,
                    password2
        
                })

            } else {
                //we want to create a new ueser model
                const newUser = new User({
                    name,
                    email, 
                    password
                });

                //Hash password, we use bcrypt to encrypt the password so it won't show on the database
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw errM;
                    //set password to hashed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can log in!')
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        })
    }

});

//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/galleries',
        failureRedirect: '/users/login',
        failureFlash: true

    }) (req, res, next);

});

//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})


module.exports = router;