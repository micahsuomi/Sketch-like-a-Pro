const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = Schema ({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        image: String
        },
        text: {
            type: String
        },
        image: {
            type: String
        },
        link: {
            type: String
        },
        title: {
            type: String
        },
        content: {
            type: String
        },
       
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Feed', feedSchema);