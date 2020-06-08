const express = require('express');
const router = express.Router();
const Gallery = require('../models/gallery');
const Like = require('../models/like');

 //adding a middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}

//INDEX Route to show all the likes
router.get('/', (req, res) => {
    res.send('this is the route to show all the likes')
})

//POST Route to post a new like

router.get('/new', (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        console.log(id)
        if(err) {
            console.log(err);
        } else {
            console.log('this is the gallery', gallery);
            console.log(req.user)
            /*
            Like.create(req.body.likes, req.user, (err, like) => {
                console.log(like)
                console.log(req.user)
                if(err) {
                    console.log(err)
                } else {
                    like.author._id = req.user._id;
                    like.author.username = req.user.username;
                    like.save();
                    gallery.likes.push(like);
                    console.log(gallery)
                }
            })*/
        }

    })
})




module.exports = router;