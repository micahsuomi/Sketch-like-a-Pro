const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    created: {
        type: Date, 
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String

    },
    //in here we do data association between a campground and the comment property
    comments: [
        {
            //. we are only embedding an id here
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            //. we are only embedding an id here
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Likes'
        }
    ]
})

module.exports = mongoose.model('Gallery', gallerySchema);