require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const serveStatic = require('serve-static');
const Gallery = require('./models/gallery');
const Comment = require('./models/comment');
const seedDataBase = require('./seeds'); 
const path = require('path')


app.use(express.static('public'))
app.use(serveStatic(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

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
    res.send('this is the about page')
})

//INDEX ROUTE galleries section, display all galleries
app.get('/galleries', (req, res) => {
    Gallery.find({}, (err, gallery) => {
        if(err) return status(404).send('Not Found');
        res.render('galleries', {gallery})
    })
})

//NEW ROUTE for submitting a new art post
app.get('/galleries/new', (req, res) => {
    res.render('new');
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
    Gallery.findOne({ _id: id}, (err, gallery) => {
        if(err) return res.status(404).send('Not Found');
        res.render('show', {gallery})
    })
})




//RUN the server
app.listen(PORT, ()=> {
    console.log(`Server is starting at PORT ${PORT}`);
})