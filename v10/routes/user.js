const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Gallery = require('../models/gallery');
const Comment = require('../models/comment');
const Post = require('../models/post');

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
router.get('/:id', middleware.isLoggedIn, (req, res) => {
    let id = req.params.id
    User.findOne({_id: id}).populate("gallery").populate("posts").populate("comments").exec((err, user) => {
        if(err) {
            console.log(err)
        }  //testing
            Gallery.find().where('author.id').equals(user._id).exec((err, gallery) => {
                if(err) {
                    console.log(err)
                }
                Post.find().where('author._id').equals(user._id).exec((err, posts) => {
                    if(err) {
                        console.log(err)
                    }   
                    console.log('gallery after finding user', gallery)

                //    gallery.splice(0, gallery.length +1);
                   console.log('here is the gallery show for testing delete', gallery)
                    //to save all the multiple updated mongoose documents
          /*  
            let total = gallery.length;
            let result = [];
            if(total > 0) {
                const saveAll = () => {
                    let doc = gallery.pop();

                    doc.save((err, saved) => {
                        if (err) throw err;//handle error

                        result.push(saved[0]);
                        console.log('result is here', result)
                        if (--total) saveAll();
                        else console.log('saved here')// all saved here
                    })
                    }

                    saveAll();  

            } else {

            }*/

                    console.log(user)
                           
                   res.render('users/show', {user, gallery, posts})

                }) 
                                                    
            })
           

          

        
    })
});

//ROUTE to show edit user form
router.get('/:id/edit', middleware.checkAccountOwnership, (req, res) => {
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
            updatedUser.firstName = userProfile.firstName;
            updatedUser.lastName = userProfile.lastName;
            updatedUser.city = userProfile.city;
            updatedUser.country = userProfile.country;
            updatedUser.email = userProfile.email;
            updatedUser.image = result.secure_url;
            updatedUser.bio = userProfile.bio;
            if(err) {
                req.flash('error', 'Something went wrong')
                res.redirect('back');
            } else {
                updatedUser.save();
                req.flash('action', 'Profile successfully updated!')
                res.redirect(`/users/${id}`)
            }
            
            //updating the profile picture of all gallery items
            Gallery.find().where('author.id').equals(updatedUser._id).exec((err, foundGallery) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log('here is the found gallery', foundGallery)
                    
                    for(const gallery of foundGallery) {
                        gallery.author.image = req.user.image
                            console.log('here the gallery should update', gallery)
                           
                        } 
                    
                    }
                    
                    //to save all the multiple updated mongoose documents

                    let total = foundGallery.length;
                    let result = [];
                    if(total > 0) {
                        const saveAll = () => {
                            let doc = foundGallery.pop();
    
                            doc.save((err, saved) => {
                                if (err) throw err;//handle error
    
                                result.push(saved[0]);
                                console.log(result)
    
                                if (--total) saveAll();
                                else console.log('saved here')// all saved here
                            })
                            }
    
                            saveAll();
                    }
                          

            })
            //updating the profile picture of all posts items
            Post.find().where('author.id').equals(updatedUser._id).exec((err, foundPost) => {
                if(err) {
                    console.log(err)
                } else {
                    
                    for(const post of foundPost) {
                        post.author.avatar = req.user.image
                            console.log('here the posts should update', post)
                           
                        } 
                    
                    }
                    
                    //to save all the multiple updated mongoose documents
                    
                    let total = foundPost.length;
                    let result = [];

                    if(total > 0) {
                        const saveAll = () => {
                            let doc = foundPost.pop();
    
                            doc.save((err, saved) => {
                                if (err) throw err;//handle error
    
                                result.push(saved[0]);
    
                                if (--total) saveAll();
                                else console.log('saved here')// all saved here
                            })
                            }
    
                            saveAll();  

                    } else {
                        console.log('do nothing')
                    }

                       

            })
        })
      

    })
});

router.delete('/:id', middleware.checkAccountOwnership, (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, user) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            //gallery, comments and likes need to be removed with the account
            console.log(user)
            req.flash('action', 'Accound deleted')
            res.redirect('/');
            
            Gallery.find().where('author.id').equals(req.user._id).exec((err, foundGallery) => {
                if(err) {
                    console.log(err)
                } else {
                    // foundGallery.splice(0, foundGallery.length +1)
                    console.log('this is the gallery after deleting user', foundGallery)

                }

            //to save all the multiple updated mongoose documents
            
            let total = foundGallery.length;
            let result = [];

                const saveAll = () => {
                    let doc = foundGallery.pop();

                    doc.save((err, saved) => {
                        if (err) throw err;//handle error
                        console.log(saved)

                        result.push(saved[0]);

                        if (--total) saveAll();
                        else console.log('saved here')// all saved here
                    })
                    }

                    saveAll();  

           
            })
        
        }
    })
})

module.exports = router;