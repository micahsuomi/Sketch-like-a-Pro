const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Gallery = require('../models/gallery');
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




//ROUTE to show user
router.get('/:id', (req, res) => {
    let id = req.params.id
    User.findOne({_id: id}).populate("gallery").exec((err, user) => {
        console.log(user.image.length)
        if(err) {
            console.log(err)
        } else {
            res.render('users/show', {user})

        }
    })
});

//ROUTE to show edit user form
router.get('/:id/edit', middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, foundUser) => {
        if(err) {
            res.redirect('back')
        } else {
            res.render('users/edit', {user: foundUser});

        }
    })
    
})

//ROUTE to update user
router.put('/:id', upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        const id = req.params.id;
        const userProfile = req.body.user;
        User.findByIdAndUpdate(id, userProfile, (err, updatedUser) => {
            updatedUser.firstName = req.body.user.firstName;
            updatedUser.lastName = req.body.user.lastName;
            updatedUser.city = req.body.user.city;
            updatedUser.country = req.body.user.country;
            updatedUser.email = req.body.user.email;
            updatedUser.image = result.secure_url;
            if(err) {
                req.flash('error', 'Something went wrong')
                res.redirect('back');
                console.log(err)
            } else {
                console.log(updatedUser.image.length)
                updatedUser.save();
                req.flash('action', 'Profile successfully updated!')
                res.redirect(`/users/${id}`)
            }
        })

    })
})

module.exports = router;