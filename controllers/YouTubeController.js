const CommentPost = require("../models/CommentPost");
const LikePost = require("../models/LikePost");
const User = require("../models/User");
const YouTubeStreaming = require("../models/YouTubeModel");
const VerifyToken = require("../validation/verifyToken");

// @route   POST api/youtube/LiveStreaming
// @desc    Create a post
// @access  Public
module.exports.PostVideo = async (req, res) => {
  try {
    if (!req.body.videoID) {
      return res.status(400).json({
        status: false,
        message: "Video ID and isStreaming is required",
      });
    }
    await YouTubeStreaming.findOne({ videoID: req.body.videoID }).then(
      async (data) => {
        if (data)
          return res.status(400).json({
            status: false,
            data: data,
            message: "Video ID already exists",
          });
      }
    );
    const videoID = req.body.videoID;
    const youtubeStreaming = new YouTubeStreaming(req.body);
    await youtubeStreaming
      .save()
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "Video uploaded successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// creating the controller for get youtubeStreaming
// @route   GET api/youtube/LiveStreaming
// @desc   get all post
// @access Public
module.exports.GetLiveVideo = async (req, res) => {
  try {
    await YouTubeStreaming.find({ isStreaming: true })
      .populate("scoreCard")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "get successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// creating the controller for getting the uploaded videos
// @route   GET api/youtube/uploadedVideos
// @desc   get all post
// @access Public
module.exports.GetUploadedVideos = async (req, res) => {
  try {
    await YouTubeStreaming.find({ isStreaming: false })
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "get successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// creating the controller for updating the liveStreaming
// @route PUT api/youtube/updateStreaming
// @desc   update the post
// @access Public
module.exports.UpdateStreaming = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        status: false,
        message: "please enter the id",
      });
    }
    await YouTubeStreaming.findOneAndUpdate(
      { id: req.body.id },
      { $set: req.body },
      { new: true }
    )
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "update successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// creating the controller for deleting the livesStreaming
// @route   DELETE api/youtube/deleteStreaming
// @desc   delete the post
// @access Public
module.exports.DeleteStreaming = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        status: false,
        message: "please enter the id",
      });
    }
    await YouTubeStreaming.findOneAndDelete({ id: req.body.id })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "delete successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// creating the router for posting the like on the streaming
// @route   POST api/youtube/streaming/like
// @desc   post the like
// @access Private
module.exports.PostLike = async (req, res) => {
  try {
   
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    } 
    
    if (!req.body.reaction || !req.body.streamingId) {
      return res.status(200).json({
        status: false,
        message: "please enter the reaction and streamingId",
      }); 
    }
 
    const like = await LikePost.create({
      user: validatedUser._id,
      reaction: req.body.reaction,
    });

    await YouTubeStreaming.findOneAndUpdate(
      { id: req.body.streamingId },
      { $push: { likes: like._id } },
      { new: true }
    ).then(async (result) => {
        return res.status(200).json({
          status: true,
          data: await YouTubeStreaming.findById({ _id: req.body.streamingId })
          .populate({ path: "likes", populate:{path:"user",select: { '_id': 0,'name':1}}})
          .populate({ path: "comments", populate:{path:"user",select: { '_id': 0,'name':1}}}),
          message: "like successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e.message,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e.message,
    });
  }
};

// creating the router for posting the comment on the streaming
// @route   POST api/youtube/streaming/comment
// @desc   post the comment
// @access Private
module.exports.PostComment = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    } 
    
    if (!req.body.comment || !req.body.streamingId) {
      return res.status(200).json({
        status: false,
        message: "please enter the comment and streamingId",
      }); 
    }
    const comment = await CommentPost.create({
      user: validatedUser._id,
      text: req.body.comment,
    });
    await YouTubeStreaming.findOneAndUpdate(
      { id: req.body.streamingId },
      { $push: { comments: comment._id } },
      { new: true }
    ).then(async (result) => {
        return res.status(200).json({
          status: true,
          data: await YouTubeStreaming.findById({ _id: req.body.streamingId })
          .populate({ path: "likes", populate:{path:"user",select: { '_id': 0,'name':1}}})
          .populate({ path: "comments", populate:{path:"user",select: { '_id': 0,'name':1}}}),
          message: "comment successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e.message,
        });
      }
    );
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e.message,
    });
  }
}
