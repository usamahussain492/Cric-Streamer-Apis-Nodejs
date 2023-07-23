//  create a post schema for uploading photos and videos

const mongoose = require("mongoose");

const youTubeStreamingSchema = new mongoose.Schema({
  
  videoID:{
    type: String,
    required: [true,"Enter the video ID"],
  },
  isStreaming:{
    type: Boolean,
    required: true,
  },
  matchId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
  },
  
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentPost",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("YouTubeStreaming", youTubeStreamingSchema);

