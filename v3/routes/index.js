const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');


//Dashboard
router.get('/galleries', ensureAuthenticated, (req, res) => 
res.render('galleries', {
    user: req.user.name
}));

module.exports = router;