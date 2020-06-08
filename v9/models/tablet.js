const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tabletSchema = Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        firstName: String,
        lastName: String,
        avatar: String
        
    },

    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tablet', tabletSchema);