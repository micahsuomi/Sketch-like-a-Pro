const express = require('express');
const router = express.Router({mergeParams: true});
const Gallery = require('../models/gallery');
const Comment = require('../models/comment');
const User = require('../models/user');
const middleware = require('../middleware/index');



//NEW COMMENT FORM routing
router.get('/new', middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('comments/new', {gallery: gallery});
    })
})

//POST a new comment route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
                    comment.author.avatar = req.user.image;
                    comment.save();
                    console.log(comment)
                    gallery.comments.push(comment);
                    gallery.save();
                    //update user comments on Schema
                    User.findByIdAndUpdate(req.params.id, req.user, (err, updatedUser) => {
                        if(err) {
                            console.log(err)
                        } else {
                            updatedUser = req.user;
                            updatedUser.comments = gallery.comments;
                            updatedUser.save();
                            console.log(updatedUser);
                        }
                     
                        
                    })
                    res.redirect(`/galleries/${gallery._id}`);
                }
            })
        }
    })
})

//EDIT ROUTE to view edit comment form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err) {
                    req.flash('You do not have permission to do that');
                    res.redirect('back');
                } else {
                    res.render('comments/edit', {gallery_id: req.params.id, comment: foundComment})
    
                }
                
            })   
    
})

//UPDATE ROUTE to update comment

router.put('/:comment_id', (req, res) => {
    const id = req.params.comment_id;
    const updatedComment = req.body.comment;
    Comment.findByIdAndUpdate(id, updatedComment, (err, comment) => {
        console.log(req.body.comment)
        if(err) {
            res.redirect('/galleries');
        } else {
            res.redirect(`/galleries/${req.params.id}`)
        }
    })
})


//DELETE ROUTE to delete comment
router.delete('/:comment_id', (req, res) => {
    const id = req.params.comment_id;
    Comment.findByIdAndRemove(id, (err) => {
        if(err) {
            req.flash('Something went wrong');
            res.redirect(`back`);
        } else {
            req.flash('action', 'Comment deleted!');
            res.redirect(`/galleries/${req.params.id}`)
            //update user
            User.findByIdAndUpdate(req.params.id, req.user,(err, updatedUser) => {
                updatedUser = req.user;
                updatedUser.save();
            })

        }
    })
})

module.exports = router;
