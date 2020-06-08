const express = require('express');
const router = express.Router();
const Gallery = require('../models/gallery');

 //adding a middleware to check if the user is logged in
 const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}

//INDEX ROUTE galleries section, display all galleries
router.get('/', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('galleries/index', {gallery})
    })
})

//NEW ROUTE for submitting a new art post
router.get('/new', isLoggedIn, (req, res) => {
    res.render('galleries/new');
})

//CREATE route to post the gallery item
router.post('/', isLoggedIn, (req, res) => {
    //get data from the form
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    let addedArtPost = new Gallery({name: name, image: image, description: description, author: author});
    addedArtPost.save((err) => {
        if(err) return res.status(404).send('Not Found');
        res.redirect('/galleries');
    }) 
    //redirect to the galleries page
})


//SHOW route to show a single gallery item
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Gallery.findOne({ _id: id}).populate("comments").exec((err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('galleries/show', {gallery})
    })
})



module.exports = router;
