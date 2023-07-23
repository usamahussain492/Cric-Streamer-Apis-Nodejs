const router = require("express").Router();
const {
  signUp,
  verifyOTP,
  login,
  deleteAll,
  sendOTP,
  changePassword,
  verifyEmail,
  resetPassword
} = require("../controllers/userController");

router.route("/signup").post(signUp);
router.route("/signup/verify").post(verifyOTP);
router.route("/login").post(login);
router.route("/deleteAll").delete(deleteAll);
router.route("/sendOTP").post(sendOTP);
router.route("/changePassword").post(changePassword);
router.route("/verifyEmail").post(verifyEmail);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
