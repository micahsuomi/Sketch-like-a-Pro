const express = require('express');
const router = express.Router();
const Gallery = require('../models/gallery');


//INDEX ROUTE galleries section, display all galleries
router.get('/', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('galleries/index', {gallery})
    })
})

//NEW ROUTE for submitting a new art post
router.get('/new', (req, res) => {
    res.render('galleries/new');
})

//CREATE route to post the gallery item
router.post('/', (req, res) => {
    //get data from the form
    let addedArtPost = new Gallery(req.body);
    console.log(addedArtPost);
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
