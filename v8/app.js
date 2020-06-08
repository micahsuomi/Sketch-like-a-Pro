require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const serveStatic = require('serve-static');
const methodOverride = require('method-override');
const seedDataBase = require('./seeds'); 
const path = require('path');
const User = require('./models/user');
const Tablet = require('./models/tablet');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');

const indexRoutes = require('./routes/index');
const galleryRoutes = require('./routes/galleries');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/user');
const tabletsRoutes = require('./routes/tablets');
const likesRoutes = require('./routes/likes');

const middleware = require('./middleware/index');
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

app.use(express.static('public'))
app.use('*/style',express.static('public/assets/style'));
app.use('*/js',express.static('public/js'));
app.use('*/imgs',express.static('public/assets/imgs'));
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Aurora is my princess',
    resave: false,
    saveUninitialized: false
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass currentUser to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.action = req.flash('action');
    next()
})


//seeds the database
//seedDataBase();

mongoose.connect(process.env.mongoDBurl, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false}, (err) => {
    if (err) return console.log(err)
    console.log('the server is connected with MongoDB')
})

//Gallery.insertMany(gallery);
//CREATE THE RESTFUL ROUTES


//ROUTE for about page
app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/tablets', (req, res) => {
    Tablet.find({}, (err, tablets) => {
        if(err) {
            console.log(err)
        } else {
            res.render('tablets', {tablets})
        }
    } )
});

app.get('/tablets/new', middleware.isLoggedIn, (req, res) => {
    res.render('tablets/new')
});

app.post('/tablets', upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function(result) {
        const name = req.body.name;
        const image = result.secure_url;
        const description = req.body.description;
        const author = {
            id: req.user_id,
            username: req.user.username,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image

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



app.use('/', indexRoutes);
app.use('/galleries', galleryRoutes);
app.use('/galleries/:id/comments', commentRoutes);
app.use('/galleries/:id/likes', likesRoutes);
// app.use('/tablets', tabletsRoutes);
app.use('/users', userRoutes);





//RUN the server
app.listen(PORT, ()=> {
    console.log(`Server is starting at PORT ${PORT}`);
})