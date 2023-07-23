// create the route for players

const router = require("express").Router();
const {
    getPlayers,
    getPlayerById,
    updatePlayerById,
    deletePlayerById,
    createPlayer,
    deleteAllPlayers,
    editPlayerScore
} = require("../controllers/playerController");

router.route("/").get(getPlayers);
router.route("/").post(createPlayer);
router.route("/:id").get(getPlayerById);
router.route("/:id").put(updatePlayerById);
router.route("/:id").delete(deletePlayerById);
router.route("/").delete(deleteAllPlayers);
router.route("/score/:matchId/:teamId/:playerId").put(editPlayerScore); 
module.exports = router;