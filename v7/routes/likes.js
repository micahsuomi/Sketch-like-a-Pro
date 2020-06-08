const express = require('express');
const router = express.Router();
const Gallery = require('../models/gallery');
const Likes = require('../models/likes');

 //adding a middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) {
            console.log(err);
        } else {
            console.log(gallery)
            res.send('this is the likes route')
            /*
            Likes.create(req.body.likes, (err, like) => {
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