// create the route for posts

const router = require("express").Router();
const multer = require("multer");

const  upload = multer({
  storage: multer.memoryStorage(),
});

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createLike,
  createComment,
  deleteComment,
  updateLike,
  deleteLike,
  updateComment,
  getUserPosts,
  createCommentLike,
  updateCommentLike,
  deleteCommentLike,
  createCommentReply,
  updateCommentReply,
  deleteCommentReply,
  getCommentReply,
} = require("../controllers/postController");


router.route("/").post(upload.array("image"),createPost);
router.route("/").get(getPosts);
router.route("/user/posts").get(getUserPosts);
router.route("/:id").get(getPostById);
router.route("/:id").put(updatePost);
router.route("/:id").delete(deletePost); 
router.route("/:id/comments").post(createComment);
router.route("/:id/likes").post(createLike);
router.route("/:id/likes/:likeId").put(updateLike);
router.route("/:id/likes/:likeId").delete(deleteLike);
router.route("/:id/comments/:commentId").put(updateComment);
router.route("/:id/comments/:commentId").delete(deleteComment);


router.route("/:id/comments/:commentId/like").post(createCommentLike);
router.route("/:id/comments/:commentId/like/:likeId").put(updateCommentLike);
router.route("/:id/comments/:commentId/like/:likeId").delete(deleteCommentLike);

router.route("/:id/comments/:commentId/reply").post(createCommentReply);
router.route("/:id/comments/:commentId/reply").get(getCommentReply);
router.route("/:id/comments/:commentId/reply/:replyId").put(updateCommentReply);
router.route("/:id/comments/:commentId/reply/:replyId").delete(deleteCommentReply);


module.exports = router;
