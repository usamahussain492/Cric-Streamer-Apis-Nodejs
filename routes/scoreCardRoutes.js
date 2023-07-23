// create the route for score card routes

const router = require("express").Router();
const {
    getScoreCards,
    getScoreCardById,
    createScoreCard,
    updateScoreCard,
    deleteScoreCard
} = require("../controllers/scoreCardController");

router.route("/").get(getScoreCards);
router.route("/").post(createScoreCard);
router.route("/:id").get(getScoreCardById);
router.route("/:id").put(updateScoreCard);
router.route("/:id").delete(deleteScoreCard);

module.exports = router;