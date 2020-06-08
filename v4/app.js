require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const serveStatic = require('serve-static');
const Gallery = require('./models/gallery');
const User = require('./models/user');
const Comment = require('./models/comment');
const seedDataBase = require('./seeds'); 
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');


app.use(express.static('public'))
app.use('*/style',express.static('public/assets/style'));
app.use('*/js',express.static('public/js'));
app.use('*/imgs',express.static('public/assets/imgs'));

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Aurora is my princess',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass currentUser to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
})

 //adding a middleware to check if the user is logged in
 const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}

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
app.get('/galleries/:id/comments/new', isLoggedIn, (req, res) => {
    const id = req.params.id;
    Gallery.findById(id, (err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('comments/new', {gallery: gallery});
    })
})

//POST a new comment route
app.post('/galleries/:id/comments', isLoggedIn, (req, res) => {
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
// ================= AUTH ROUTES ==============================

//SHOW route for register form
app.get('/register', (req, res) => {
    res.render('register');
})

//POST route to handle the registration logic
app.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err)
            return res.render('register')
        } 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/galleries')
        })
    })
})

//LOGIN show to show the login form
app.get('/login', (req, res) => {
    res.render('login');
})

//LOGIN logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/galleries',
    failureRedirect: '/login'
}), (req, res) => {
});

//LOGOUT
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/galleries');
});

// ============================================================





//RUN the server
app.listen(PORT, ()=> {
    console.log(`Server is starting at PORT ${PORT}`);
})