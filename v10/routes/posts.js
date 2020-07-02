const express = require('express');
const router = express.Router();
const Post = require('../models/post');
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

//INDEX ROUTE to show all posts
router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
      if(err) {
          console.log(err)
      } else {
          res.render('posts', {posts})
          console.log(posts)
      }
  } )
});

//NEW ROUTE to get to the add new tablet reveiw form
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('posts/new');
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

      let addedPost = new Post({name: name, image: image, description: description, author: author});
      addedPost.save((err) => {
          if(err) {
              console.log(err)
          } else {
              res.redirect('/posts');
          }

          User.findByIdAndUpdate(req.params.id, req.user, (err, updatedUser) => {
            updatedUser = req.user
            if(err) {
                console.log(err)
            } else {
                updatedUser.posts.push(addedPost);
                updatedUser.save();
                console.log(updatedUser)
    
            }
        })
      });

  })

})

//SHOW ROUTE to show a single tablet
router.get('/:id', (req, res) => {
  let id = req.params.id
  Post.findById(id, (err, post) => {
      if(err) {
          req.flash('error', 'Not Found')
      } else {
          res.render('posts/show', {post})

      }
  })
});

//EDIT SHOW ROUTE to show the edit form
router.get('/:id/edit', middleware.checkReviewOwnership, (req, res) => {
  let id = req.params.id;
  Post.findById(id, (err, post) => {
    if(err) {
      req.flash('You do not have permission to do that');
      res.redirect('back');
    } else {
      console.log(post)
      res.render('posts/edit', {post});

    }
  })
});

//PUT route to update the edited tablet
router.put('/:id', middleware.checkReviewOwnership, upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function(result) {
  let id = req.params.id;
  let post = req.body.post;
  Post.findByIdAndUpdate(id, post, (err, updatedPost) => {
    updatedPost.name = req.body.name;
    updatedPost.description = req.body.description;
    updatedPost.image = result.secure_url;

    if(err) {
      req.flash('Something Went Wrong');
      res.redirect('/posts');
    } else {
      updatedPost.save();
      req.flash('action', 'Review Updated!')
      res.redirect(`/posts/${id}`);
    }
  })
})
});

router.delete('/:id', middleware. checkReviewOwnership, (req, res) => {
  let id = req.params.id;
  Post.findByIdAndRemove(id, (err) => {
    if(err) {
      req.flash('Something went wrong');
      res.redirect('back')
    } else {
      req.flash('actions', 'Post Deleted!');
      res.redirect('/posts')
    }
  })
});




module.exports = router;