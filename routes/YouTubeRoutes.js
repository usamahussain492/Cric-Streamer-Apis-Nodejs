const router = require("express").Router();
const {
    PostVideo, GetLiveVideo, GetUploadedVideos, UpdateStreaming, DeleteStreaming, PostLike, PostComment
} = require("../controllers/YouTubeController");

router.route("/livestreaming").post(PostVideo);
router.route("/currentLive").get(GetLiveVideo);
router.route("/uploadedVideos").get(GetUploadedVideos);
router.route("/updateStreaming").put(UpdateStreaming);
router.route("/deleteStreaming").delete(DeleteStreaming);
router.route("/streaming/like").post(PostLike)
router.route("/streaming/comment").post(PostComment)


module.exports = router;