require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const serveStatic = require('serve-static');

const seedDataBase = require('./seeds'); 
const path = require('path');
const User = require('./models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const indexRoutes = require('./routes/index');
const galleryRoutes = require('./routes/galleries');
const commentRoutes = require('./routes/comments');


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


//seeds the database
// seedDataBase();

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



app.use('/', indexRoutes);
app.use('/galleries', galleryRoutes);
app.use('/galleries/:id/comments', commentRoutes);

//RUN the server
app.listen(PORT, ()=> {
    console.log(`Server is starting at PORT ${PORT}`);
})