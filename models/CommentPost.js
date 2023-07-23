// comment post schema 

const mongoose = require("mongoose");

const commentPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like",
        }
    ],
    replies:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentPost",
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CommentPost", commentPostSchema);
