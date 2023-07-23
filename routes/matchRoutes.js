// create the route for match

const router = require("express").Router();
const {
    getMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    getScoreCard,
    updateScoreCard,
    deleteAllMatches
} = require("../controllers/matchController");

router.route("/").get(getMatches);
router.route("/").post(createMatch);
router.route("/:id").get(getMatchById);
router.route("/:id").put(updateMatch);
router.route("/:id").delete(deleteMatch);
router.route("/").delete(deleteAllMatches)
router.route("/:id/scorecard").get(getScoreCard);
router.route("/:id/scorecard").put(updateScoreCard);

module.exports = router; 