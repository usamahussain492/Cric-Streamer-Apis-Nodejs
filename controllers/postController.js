// create all post controller

const Post = require("../models/Post");
const CommentPost = require("../models/CommentPost");
const LikePost = require("../models/LikePost");
const User = require("../models/User");
const Team = require("../models/Team");
const Match = require("../models/Match");
const ScoreCard = require("../models/ScoreCard");
const VerifyToken = require("../validation/verifyToken");
const addImage = require("../constants/addImage");

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const posts = await Post.find()
    .populate("user")
    .populate("likes")
    .populate({
      path: "comments",
      populate: {
        path: "likes",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .populate({
      path: "comments",

      populate: {
        path: "replies",
      },
    })
      .sort({ date: -1 });
    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   GET api/posts/user/posts
// @desc    Get all user posts
// @access  Private
exports.getUserPosts = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const posts = await Post.find({ user: validatedUser._id })
    .populate("user")
    .populate("likes")
    .populate({
      path: "comments",
      populate: {
        path: "likes",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .populate({
      path: "comments",

      populate: {
        path: "replies",
      },
    })
      .sort({ date: -1 });
    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
exports.getPostById = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "likes",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",

        populate: {
          path: "replies",
        },
      })
      .sort({ date: -1 });
    res.status(200).json({
      status: true,
      data: post,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts
// @desc    Create post
// @access  Private
exports.createPost = async (req, res) => {
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

    if (!req.body.text || req.files.length <= 0) {
      return res.status(400).json({
        status: false,
        message: "Post Text and photos is required",
      });
    } else {
      console.log(validatedUser._id);
      let files = [];
      for (let file of req.files) {
        const image = await addImage(file);
        files.push(image);
      }
      const post = new Post({
        text: req.body.text,
        photos: files,
        user: validatedUser._id,
      });
      await post.save();
      return res.status(200).json({
        status: true,
        data: await Post.findById(post._id)
          .populate("user")
          .populate("likes")
          .populate({
            path: "comments",
            populate: {
              path: "likes",
            },
          })
          .populate({
            path: "comments",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "comments",

            populate: {
              path: "replies",
            },
          }),
        message: "Post created successfully",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
exports.updatePost = async (req, res) => {
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

    //const post = await Post.findByIdAndUpdate(req.params.id, req.body).where({ user: validatedUser._id });
    await Post.findByIdAndUpdate(req.params.id, req.body)
      .where({ user: validatedUser._id })
      .populate("user")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "likes",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",

        populate: {
          path: "replies",
        },
      })
      .then(async (post) => {
        res.status(200).json({
          status: true,
          data: await Post.findById(req.params.id)
            .where({
              user: validatedUser._id,
            })
            .populate("user")
            .populate("likes")
            .populate({
              path: "comments",
              populate: {
                path: "likes",
              },
            })
            .populate({
              path: "comments",
              populate: {
                path: "user",
              },
            })
            .populate({
              path: "comments",

              populate: {
                path: "replies",
              },
            }),
          message: "Post updated successfully",
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
exports.deletePost = async (req, res) => {
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
    const post = await Post.deleteOne({ _id: req.params.id }).where({
      user: validatedUser._id,
    });
    res.status(200).json({
      status: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/comments
// @desc    Create comment
// @access  Private
exports.createComment = async (req, res) => {
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
    const user = validatedUser._id;
    //console.log(user)
    if (!req.body.text) {
      return res.status(400).json({
        status: false,
        message: "Comment text is required",
      });
    }
    const { text } = req.body;
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "likes",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",

        populate: {
          path: "replies",
        },
      });
    const newComment = new CommentPost({
      text,
      user,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "Comment created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/likes
// @desc    Create like
// @access  Private
exports.createLike = async (req, res) => {
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
    const user = validatedUser._id;
    if (!req.body.reaction) {
      return res.status(400).json({
        status: false,
        message: "Reaction is required",
      });
    }
    const { reaction } = req.body;

    const post = await Post.findById(req.params.id);
    const newLike = new LikePost({
      user,
      reaction,
    });
    await newLike.save();
    post.likes.push(newLike._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "Like created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route Put api/posts/:id/likes/:likeId
// @desc Update like
// @access Private
exports.updateLike = async (req, res) => {
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

    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
        populate: {
          path: "replies",
        },
      });
    const like = await LikePost.findById(req.params.likeId).where({
      user: validatedUser._id,
    });
    like.reaction = req.body.reaction;
    await like.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "Like updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id/likes/:likeId
// @desc    Delete like
// @access  Private
exports.deleteLike = async (req, res) => {
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
    const post = await Post.findById(req.params.id);
    const like = await LikePost.findById(req.params.likeId).where({
      user: validatedUser._id,
    });
    await like.remove();
    post.likes.pull(like._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
          populate: {
            path: "likes",
          },
          populate: {
            path: "replies",
          },
        }),
      message: "Like deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   PUT api/posts/:id/comment/:commentId
// @desc    Update comment
// @access  Private
exports.updateComment = async (req, res) => {
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
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
        populate: {
          path: "replies",
        },
      });
    const comment = await CommentPost.findById(req.params.commentId).where({
      user: validatedUser._id,
    });
    comment.text = req.body.text;
    await comment.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "Comment updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id/comment/:commentId
// @desc    Delete comment
// @access  Private
exports.deleteComment = async (req, res) => {
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
    const post = await Post.findById(req.params.id);
    const comment = await CommentPost.findById(req.params.commentId).where({
      user: validatedUser._id,
    });
    await comment.remove();
    post.comments.pull(comment._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "Comment deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/comments/:commentId/like
// @desc    Create like
// @access  Private
exports.createCommentLike = async (req, res) => {
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
    const user = validatedUser._id;
    if (!req.body.reaction) {
      return res.status(400).json({
        status: false,
        message: "Reaction is required",
      });
    }
    const { reaction } = req.body;
    const newLike = new LikePost({
      user,
      reaction,
    });
    await newLike.save();
    let comment = await CommentPost.findById(req.params.commentId);
    comment.likes.push(newLike._id);
    await comment.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),

      message: "comment like created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   Put api/posts/:id/comments/:commentId/like/:likeId
// @desc    Update like
// @access  Private
exports.updateCommentLike = async (req, res) => {
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
    const user = validatedUser._id;
    if (!req.body.reaction) {
      return res.status(400).json({
        status: false,
        message: "Reaction is required",
      });
    }
    const { reaction } = req.body;
    await LikePost.findByIdAndUpdate(req.params.likeId, { reaction: reaction });

    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "comment like updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   Delete api/posts/:id/comments/:commentId/like/:likeId
// @desc    Delete like
// @access  Private
exports.deleteCommentLike = async (req, res) => {
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
    const user = validatedUser._id;

    await LikePost.findByIdAndDelete(req.params.likeId);
    let comment = await CommentPost.findById(req.params.commentId);
    comment.likes.pull(req.params.likeId);
    await comment.save();

    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "comment like deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/comments/:commentId/reply
// @desc    Create reply for comment
// @access  Private
exports.createCommentReply = async (req, res) => {
  try {
    console.log("this is a comment reply")
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
    const user = validatedUser._id;
    if (!req.body.text) {
      return res.status(400).json({
        status: false,
        message: "Text is required",
      });
    }
    const { text } = req.body;
    const newComment = new CommentPost({
      user,
      text,
    });
    await newComment.save();
    let comment = await CommentPost.findById(req.params.commentId);
    comment.replies.push(newComment._id);
    await comment.save();
    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "comment reply created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   Put api/posts/:id/comments/:commentId/like/:replyId
// @desc    Update reply of comment
// @access  Private
exports.updateCommentReply = async (req, res) => {
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
    const user = validatedUser._id;
    if (!req.body.text) {
      return res.status(400).json({
        status: false,
        message: "Text is required",
      });
    }
    const { text } = req.body;
    await CommentPost.findByIdAndUpdate(req.params.replyId, { text: text });

    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "comment reply updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   Delete api/posts/:id/comments/:commentId/like/:replyId
// @desc    Delete reply of comments
// @access  Private
exports.deleteCommentReply = async (req, res) => {
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
    const user = validatedUser._id;

    await CommentPost.findByIdAndDelete(req.params.replyId);
    let comment = await CommentPost.findById(req.params.commentId);
    comment.replies.pull(req.params.replyId);
    await comment.save();

    res.status(200).json({
      status: true,
      data: await Post.findById(req.params.id)
        .populate("user")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "likes",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",

          populate: {
            path: "replies",
          },
        }),
      message: "comment reply deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};



// @route   Get api/posts/:id/comments/:commentId/reply
// @desc    get replies of comments
// @access  Private
exports.getCommentReply = async (req, res) => {
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
    const user = validatedUser._id;

    let comments = await CommentPost.findById(req.params.commentId).populate("user")
    .populate("likes")
    .populate({
      path: "replies",
      populate: {
        path: "likes",
      },
    })
    .populate({
      path: "replies",
      populate: {
        path: "user",
      },
    })
    .populate({
      path: "replies",

      populate: {
        path: "replies",
      },
    });
    

    res.status(200).json({
      status: true,
      data: comments,
      message: "Comments getted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};
