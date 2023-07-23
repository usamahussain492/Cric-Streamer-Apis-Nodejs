const VerifyToken = require("../validation/verifyToken");
const ScoreCard = require("../models/ScoreCard");

// creating the controller for all score cards
// @route GET api/scoreCard
// @desc get all score cards
// @access Private
exports.getScoreCards = async (req, res) => {
    try {
        const validatedUser = VerifyToken(req, res);
        if (!validatedUser) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }
        const scoreCards = await ScoreCard.find({});
        return res.status(200).json({
            status: true,
            message: "Score cards fetched successfully",
            scoreCards: scoreCards,
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// creating the controller for get score card by id
// @route GET api/scoreCard/id
// @desc get score card by id
// @access Private
exports.getScoreCardById = async (req, res) => {
    try {
        const validatedUser = VerifyToken(req, res);
        if (!validatedUser) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }
        const scoreCard = await ScoreCard.findById(req.params.id);
        if (!scoreCard) {
        return res.status(400).json({
            status: false,
            message: "Score card not found",
        });
        }
        return res.status(200).json({
            status: true,
            message: "Score card fetched successfully",
            scoreCard: scoreCard,
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};


// creating the controller for create a score card
// @route POST api/scoreCard
// @desc create a score card
// @access Private
exports.createScoreCard = async (req, res) => {
    try {
        const validatedUser = VerifyToken(req, res);
        if (!validatedUser) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }
        if(!req.body.matchId || !req.body.userId || !req.body.matchVideo){
            return res.status(400).json({
                status: false,
                message: "Please fill all the fields",
            });
        }
        const scoreCard = await ScoreCard.create(req.body);
        return res.status(200).json({
            status: true,
            message: "Score card created successfully",
            scoreCard: scoreCard,
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

// creating the controller for update a score card
// @route PUT api/scoreCard/id
// @desc update a score card
// @access Private
exports.updateScoreCard = async (req, res) => {
    try {
        const validatedUser = VerifyToken(req, res);
        if (!validatedUser) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }
        const scoreCard = await ScoreCard.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!scoreCard) {
        return res.status(400).json({
            status: false,
            message: "Score card not found",
        });
        }
        return res.status(200).json({
            status: true,
            message: "Score card updated successfully",
            scoreCard: scoreCard,
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

// creating the controller for delete a score card
// @route DELETE api/scoreCard/id
// @desc delete a score card
// @access Private
exports.deleteScoreCard = async (req, res) => {
    try {
        const validatedUser = VerifyToken(req, res);
        if (!validatedUser) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }
        const scoreCard = await ScoreCard.findByIdAndDelete(req.params.id);
        if (!scoreCard) {
        return res.status(400).json({
            status: false,
            message: "Score card not found",
        });
        }
        return res.status(200).json({
            status: true,
            message: "Score card deleted successfully",
            scoreCard: scoreCard,
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

