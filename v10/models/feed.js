const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = Schema ({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
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
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Feed', feedSchema);