require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const serveStatic = require('serve-static');
const Gallery = require('./models/gallery');
const Comment = require('./models/comment');
const seedDataBase = require('./seeds'); 
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const {ensureAuthenticated} = require('./config/auth');
require('./config/passport')(passport);





app.use(express.static('public'))
app.use('*/style',express.static('public/assets/style'));
app.use('*/js',express.static('public/js'));
app.use('*/imgs',express.static('public/assets/imgs'));

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  //Connect flash
  app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');


    next(); 
})

//Routes 
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.get('/', (req, res) => {
    res.render('index')
})

seedDataBase();

mongoose.connect(process.env.mongoDBurl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err)
    console.log('the server is connected with MongoDB')
})

//Gallery.insertMany(gallery);
//CREATE THE RESTFUL ROUTES


//ROUTE for about page
app.get('/about', (req, res) => {
    res.render('about')
})

//INDEX ROUTE galleries section, display all galleries
app.get('/galleries', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('galleries/index', {gallery})
    })
})

//NEW ROUTE for submitting a new art post
app.get('/galleries/new', (req, res) => {
    res.render('galleries/new');
})

//CREATE route to post the gallery item
app.post('/galleries', (req, res) => {
    //get data from the form
    let addedArtPost = new Gallery(req.body);
    console.log(addedArtPost);
    addedArtPost.save((err) => {
        if(err) return res.status(404).send('Not Found');
        res.redirect('/galleries');
    }) 
    //redirect to the galleries page
})


//SHOW route to show a single gallery item
app.get('/galleries/:id', (req, res) => {
    let id = req.params.id;
    Gallery.findOne({ _id: id}).populate("comments").exec((err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('galleries/show', {gallery})
    })
})


// ==================== COMMENTS ROUTES =======================

//NEW COMMENT FORM routing
app.get('/galleries/:id/comments/new', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('comments/new', {gallery: gallery});
    })
})

//POST a new comment route
app.post('/galleries/:id/comments', (req, res) => {
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
                    gallery.comments.push(comment);
                    gallery.save();
                    res.redirect(`/galleries/${gallery._id}`);
                }
            })
        }
    })
})

// ============================================================




//RUN the server
app.listen(PORT, ()=> {
    console.log(`Server is starting at PORT ${PORT}`);
})