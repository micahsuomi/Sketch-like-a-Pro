const express = require('express');
const router = express.Router();
const Tablet = require('../models/tablet');
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

//INDEX ROUTE to show all tablets
router.get('/', (req, res) => {
  Tablet.find({}, (err, tablets) => {
      if(err) {
          console.log(err)
      } else {
          res.render('tablets', {tablets})
          console.log(tablets)
      }
  } )
});

//NEW ROUTE to get to the add new tablet reveiw form
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('tablets/new');
  console.log(req.user)
});

//POST ROUTE to post a new tablet review
router.post('/', upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function(result) {
      const name = req.body.name;
      const image = result.secure_url;
      const description = req.body.description;
      const author = {
          id: req.user._id,
          username: req.user.username,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          avatar: req.user.image

      }

      let addedTablet = new Tablet({name: name, image: image, description: description, author: author});
      addedTablet.save((err) => {
          if(err) {
              console.log(err)
          } else {
              res.redirect('/tablets');
          }
      });

  })

})

//SHOW ROUTE to show a single tablet
router.get('/:id', (req, res) => {
  let id = req.params.id
  Tablet.findById(id, (err, tablet) => {
      if(err) {
          req.flash('error', 'Not Found')
      } else {
          res.render('tablets/show', {tablet})
          console.log('this is the found tablet', tablet)

      }
  })
});

//EDIT SHOW ROUTE to show the edit form
router.get('/:id/edit', middleware.checkReviewOwnership, (req, res) => {
  let id = req.params.id;
  Tablet.findById(id, (err, tablet) => {
    if(err) {
      req.flash('You do not have permission to do that');
      res.redirect('back');
    } else {
      console.log(tablet)
      res.render('tablets/edit', {tablet});

    }
  })
});

//PUT route to update the edited tablet
router.put('/:id', middleware.checkReviewOwnership, upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function(result) {
  let id = req.params.id;
  let tabletPost = req.body.tablet;
  Tablet.findByIdAndUpdate(id, tabletPost, (err, updatedTabletPost) => {
    updatedTabletPost.name = req.body.name;
    updatedTabletPost.description = req.body.description;
    updatedTabletPost.image = result.secure_url;
    console.log('here the image should be the new one', updatedTabletPost.image)

    if(err) {
      console.log(err);
      req.flash('Something Went Wrong');
      res.redirect('/tablets');
    } else {
      updatedTabletPost.save();
      console.log('here is the updated post', updatedTabletPost)
      req.flash('action', 'Review Updated!')
      res.redirect(`/tablets/${id}`);
    }
  })
})
});

router.delete('/:id', middleware. checkReviewOwnership, (req, res) => {
  let id = req.params.id;
  Tablet.findByIdAndRemove(id, (err) => {
    if(err) {
      req.flash('Something went wrong');
      res.redirect('back')
    } else {
      req.flash('actions', 'Review Deleted!');
      res.render('/tablets')
    }
  })
});




module.exports = router;