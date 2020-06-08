const express = require('express');
const router = express.Router({mergeParams: true});
const Gallery = require('../models/gallery');
const Comment = require('../models/comment');

 //adding a middleware to check if the user is logged in
 const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}


//NEW COMMENT FORM routing
router.get('/new', isLoggedIn, (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('comments/new', {gallery: gallery});
    })
})

//POST a new comment route
router.post('/', isLoggedIn, (req, res) => {
    //lookup the gallery item using it
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) {
            return res.status(404).send('Not found')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    return res.status(404).send('Not Found')
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log(comment)
                    comment.save();
                    gallery.comments.push(comment);
                    gallery.save();
                    res.redirect(`/galleries/${gallery._id}`);
                }
            })
        }
    })
})

module.exports = router;
