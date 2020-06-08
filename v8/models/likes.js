const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Likes', LikesSchema);