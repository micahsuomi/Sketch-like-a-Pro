const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Gallery = require('../models/gallery');


const passport = require('passport');


router.get('/', (req, res) => {
    User.find({}).
    populate({path: 'gallery', perDocumentLimit: 1}).populate('comments').exec((err, user) => {
        if(err) return status(404).send('Not Found');

        Gallery.find({}).
        populate({path: 'comments'}).
        populate({path: 'likes'}).exec((err, gallery) => {
            if(err) {
                res.send('page not found')
            }
            Post.find({},(err, posts) => {
                if(err) {
                    res.send('page not found')
                } 
                console.log(user.comments)
                console.log(gallery)
                res.render('index', {user, gallery, posts})
    
            })
        })
       
    })
})

let errors = [
    {firstNameErr: ''},
    {lastNameErr: ''},
    {emailErr: ''},
    {usernameErr: ''},
    {pwErr: ''},
    {pwErr2: ''}
];    

//SHOW route for register form
router.get('/register', (req, res) => {
    res.render('register', {errors: errors});
})

//POST route to handle the registration logic
router.post('/register', (req, res) => {
    const { firstName, lastName, email, username, password, password2 } = req.body;
    if(firstName.length < 2) {
        errors[0].firstNameErr ='First Name should include at least two characters';
    } else {
        errors[0].firstNameErr ='';

    }
    if(lastName.length < 2) {
        errors[1].lastNameErr = 'Last Name should include at least two characters';
    } else {
        errors[1].lastNameErr = '';

    }
    let emailPattern = /^[a-z0-9.-_]+@[a-z0-9.-_]+\.[a-z]{2,}$/ig;
    if(!email.match(emailPattern)) {
        errors[2].emailErr = 'Email must be a valid address, e.g. example@example.com';
    } else {
        errors[2].emailErr = '';

    }
    if(username.length < 6) {
        errors[3].usernameErr = 'Username must be at least 6 characters';
    } else {
        errors[3].usernameErr = '';

    }
    if(password.length < 6) {
        errors[4].pwErr = 'Password must be at least 6 characters';
    } else {
        errors[4].pwErr = '';

    }
    if(password !== password2) {
        errors[5].pwErr2 = 'passwords do not match';
    } else {
        errors[5].pwErr2 = '';

    }
    
    if(errors[0].firstNameErr != '' ||  errors[1].lastNameErr != '' || errors[2].emailErr != '' || errors[3].usernameErr != '' || errors[4].pwErr != '' || errors[5].pwErr2 != '' ) {
        res.render('register', {
            errors, 
            firstName,
            lastName,
            email,
            username, 
            password,
            password2
        })
            console.log(firstName)
        console.log('here are the errors', errors, errors.length)
    } else {
        console.log('there are no errors', errors, errors.length)
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username, 
            image: '',
            city: '',
            country: '',
            bio: ''
    
        })
        User.register(newUser, req.body.password, (err, user) => {
            if(err) {
                req.flash('error', err.message);
                res.redirect('back');
            } 
            passport.authenticate('local')(req, res, () => {
                req.flash('success', `Welcome to your profile ${newUser.username}!`)
                res.redirect(`/users/${req.user._id}`);
            })
        })
    }
    
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

