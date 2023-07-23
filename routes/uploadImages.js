
const router = require("express").Router();
const multer = require("multer");
const { UploadImage,UploadImages } = require("../controllers/uploadImageController");


const  upload = multer({
  storage: multer.memoryStorage(),
});


router.route("/image").post(upload.single("image"), UploadImage);
router.route("/images").post(upload.array("image"), UploadImages);
 module.exports = router;