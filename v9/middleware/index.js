const User = require('../models/user');
const Gallery = require('../models/gallery');
const Comment = require('../models/comment');
const Tablet = require('../models/tablet');

const middlewareObj = {};

 //adding a middleware to check if the user is logged in
 middlewareObj.isLoggedIn = (req, res, next) => {
   if(req.isAuthenticated()) {
       return next()
   }
   req.flash('error', 'Please Login first')
   res.redirect('/login');
}
 //adding a middleware to check if the user the owner of his account
 middlewareObj.checkAccountOwnership = (req, res, next) => {
     if(req.isAuthenticated()) {
         let id = req.params.id;
         User.findById(id, (err, foundUser) => {
             console.log('this is the found user', foundUser)
           if(err) {
               req.flash('error', 'You do not have permission to do that');
               res.redirect('back');
           }  else {
               if(foundUser._id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash('error',`Gotcha ${req.user.firstName} ${req.user.lastName}! You do not have permission to do that!!!`)
                   res.redirect('back');
               }
           }
         })
     }  else {
        res.redirect('back');
    }
 }

 //adding a middleware to check if the user the owner of the post
 middlewareObj.checkPostOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        let id = req.params.id;
        Gallery.findById(id, (err, foundGalleryPost) => {
            if(err) {
                req.flash('error', 'You do not have permission to do that')
                res.redirect('back')
            } else {
                if(foundGalleryPost.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

//adding a middleware to check if the user the owner of the post
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        let id = req.params.comment_id;
        Comment.findById(id, (err, foundComment) => {
            if(err) {
                req.flash('error', 'You do not have permission to do that')
                res.redirect('back')
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', 'You do not have permission to do that!!!')
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

//adding a middleware to check if the user the owner of the post
middlewareObj.checkReviewOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        let id = req.params.id;
        Tablet.findById(id, (err, foundTablet) => {
            if(err) {
                req.flash('You do not have permission to do that');
                res.redirect('back');
            } else {
                if(foundTablet.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('You do not have permission to do that');
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

module.exports = middlewareObj;