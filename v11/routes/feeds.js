const express = require('express');
const router = express.Router({mergeParams: true});
require('dotenv').config();
const Feed = require('../models/feed');
const middleware = require('../middleware/index');

router.get('/', (req, res) => {
    Feed.find({}, (err, foundFeeds) => {
        if(err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            foundFeeds.reverse();
            console.log('feeds index',foundFeeds)
            res.render('feeds/index',  {foundFeeds})
        }
    })
});







module.exports = router;