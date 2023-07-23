const router = require("express").Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
    getTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById,
    deleteAllTeams,
    changeCaptain

} = require("../controllers/teamController")

router.route("/").get(getTeams);
router.route("/").post(upload.array("image"),createTeam);
router.route("/:id").get(getTeamById);
router.route("/:id").put(updateTeamById);
router.route("/:id").delete(deleteTeamById);
router.route("/").delete(deleteAllTeams);
router.route("/:teamId/changeCaptain").put(changeCaptain)


module.exports = router;

