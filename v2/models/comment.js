const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema ({
    text: {
        type : String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Comment', commentSchema);
