// create a like schema for like the posts

const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter user"],
    },
    reaction: {
        type: String,
        required: [true, "Enter reaction"]
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Like', LikeSchema)