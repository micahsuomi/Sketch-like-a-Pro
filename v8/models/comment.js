const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema ({
    text: {
        type : String,
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        avatar: String
    },
    created: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Comment', commentSchema);
