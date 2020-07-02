const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    city: String,
    country: String,
    image: String,
    bio: String,
    gallery: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gallery'
        }

    ],
    comments: [
        {
            //. we are only embedding an id here
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    feeds: [
        
    ]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);