const express = require('express');
const router = express.Router();
require('dotenv').config();
const Gallery = require('../models/gallery');
const User = require('../models/user');
const middleware = require('../middleware/index');
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'du66vzeok', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX ROUTE galleries section, display all galleries
router.get('/', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('galleries/index', {gallery})
    })
})

//NEW ROUTE for submitting a new art post
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('galleries/new');
})

//CREATE route to post the gallery item
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
    //get data from the form
    const name = req.body.name;
    // const image = req.body.image;
    const image = result.secure_url;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username,
        image: req.user.image
    }
    let addedArtPost = new Gallery({name: name, image: image, description: description, author: author});
    addedArtPost.save((err) => {
        //user gallery array will be updated with a new item
            if(err) {
                res.redirect('/galleries', req.flash('error', 'Something went wrong'))   
            } else {
                req.flash('action', 'Post Added!')
                res.redirect('/galleries');
            }
            
            User.findByIdAndUpdate(req.params.id, req.user, (err, updatedUser) => {
                updatedUser = req.user
                if(err) {
                    console.log(err)
                } else {
                    updatedUser.gallery.push(addedArtPost);
                    updatedUser.save();
                    console.log(updatedUser)
        
                }
            })
            
        
       
    
    
    }) 
    
    //redirect to the galleries page
})
})


//SHOW route to show a single gallery item
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Gallery.findOne({ _id: id}).populate("comments").exec((err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('galleries/show', {gallery})
    })
});

//EDIT ROUTE to open the edit form
router.get('/:id/edit', middleware.checkPostOwnership, (req, res) => {
    let id = req.params.id;
    Gallery.findById(id, (err, foundGalleryItem) => {
        console.log(foundGalleryItem)
        res.render('galleries/edit', {gallery: foundGalleryItem})
    })
})

//UPDATE ROUTE to update the edited post
router.put('/:id', middleware.checkPostOwnership,  upload.single('image'),(req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {

    //find and update the gallery
    let id = req.params.id;
    let galleryPost = req.body.gallery;
    Gallery.findByIdAndUpdate(id, galleryPost, (err, updatedGalleryPost) => {
        updatedGalleryPost.name = req.body.name
        updatedGalleryPost.description = req.body.description
        updatedGalleryPost.image = result.secure_url;
        if(err) {
            req.flash('error', 'Something went wrong')
            res.redirect('/galleries')
        } else {
            updatedGalleryPost.save();
            req.flash('action', 'Gallery Updated!')
            res.redirect(`/galleries/${id}`);
        }
    })
})
});

//DESTROY ROUTE to delete post
router.delete('/:id', middleware.checkPostOwnership, (req, res) => {
    let id = req.params.id;
    Gallery.findByIdAndRemove(id, (err) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('action', 'Gallery Item Deleted!')
            res.redirect('/galleries');
            /*User.findOne({_id: req.params.id}).populate("gallery").exec((err, user) => {
                console.log('this is the user', user)
                if(err) {
                    console.log(err)
                } else {
                    user.save();
        
                }
            })*/
           
        }
    })
})



module.exports = router;
