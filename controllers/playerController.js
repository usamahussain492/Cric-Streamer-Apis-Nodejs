const VerifyToken = require("../validation/verifyToken");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Match = require("../models/Match");

// create a get controller for all players
// @route GET api/player
// @desc get all players
// @access Private
exports.getPlayers = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const players = await Player.find({});
    return res.status(200).json({
      status: true,
      message: "Players fetched successfully",
      players: players,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

// create a controller for create player
// @route POST api/player
// @desc create player
// @access Private
exports.createPlayer = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    if (!req.body.cnic) {
      return res.status(400).json({
        status: false,
        message: "Please enter cnic",
      });
    }
    const isExist = await Player.findOne({ cnic: req.body.cnic });
    //console.log(isExist);
    if (isExist) {
      return res.status(200).json({
        status: true,
        message: "Player already created successfully",
        player: isExist,
      });
    }
    if (!req.body.name || !req.body.role || !req.body.cnic) {
      return res.status(400).json({
        status: false,
        message: "Player name, role and cnic are required",
      });
    }
    const player = await Player.create(req.body);
    return res.status(200).json({
      status: true,
      message: "Player created successfully",
      player: player,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// create a controller for get player by id
// @route GET api/player/id
// @desc get player by id
// @access Private
exports.getPlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Player fetched successfully",
      player: player,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// update player by id
// @route PUT api/player/id
// @desc update player by id
// @access Private
exports.updatePlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create a controller for delete player by id
// @route DELETE api/player/id
// @desc delete player by id
// @access Private
exports.deletePlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    await Player.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Player deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create api for deleting the all players
// @route DELETE api/player
// @desc delete all players
// @access Private
exports.deleteAllPlayers = async (req, res) => {
  try {
    await Player.deleteMany({})
      .then(() => {
        return res.status(200).json({
          status: true,
          message: "Players deleted successfully",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: false,
          error: err,
          message: "Players not deleted successfully",
        });
      });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// creating the controller for editing the player score
// @route PUT api/player/score/:matchId/:teamId/:playerId
// @desc edit player score
// @access Private
exports.editPlayerScore = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.playerId);
    const team = await Team.findById(req.params.teamId);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    if (!team) {
      return res.status(400).json({
        status: false,
        message: "Team not found",
      });
    }
    await player.playerScoreList.forEach((score) => {
      if (
        score.matchId == req.params.matchId &&
        score.teamId == req.params.teamId
      ) {
        score.playedTotalScore += req.body.playedTotalScore;
        score.bolledTotalScore += req.body.bolledTotalScore;
        score.overs = req.body.overs;
        score.wickets += req.body.wickets;

        if (req.body.bolledTotalScore == 0) {
          team.teamScoreList.forEach((score) => {
            score.totalScore += req.body.playedTotalScore;
            score.overs = req.body.overs;
            score.wickets += req.body.wickets;
          });
        }
      }
    });

    player.save();
    team.save();

    let match = await Match.findById(req.params.matchId)
      .populate({
        path: "team1",
        populate: { path: "image" },
      })
      .populate({
        path: "team1",
        populate: { path: "logo" },
      })
      .populate({
        path: "team1",
        populate: { path: "players" },
      })
      .populate({
        path: "team2",
        populate: { path: "image" },
      })
      .populate({
        path: "team2",
        populate: { path: "logo" },
      })
      .populate({
        path: "team2",
        populate: { path: "players" },
      })
      .populate({
        path: "winner",
        populate: { path: "image" },
      })
      .populate({
        path: "winner",
        populate: { path: "logo" },
      })
      .populate({
        path: "winner",
        populate: { path: "players" },
      })
      .populate("userId")
      .populate("winner");
 
    let UpdateMatch = await match;
    
    UpdateMatch.team1.teamScoreList = await match.team1.teamScoreList.map(
      (score) => score.matchId == req.params.matchId
    );
    UpdateMatch.team2.teamScoreList = await match.team2.teamScoreList.map(
      (score) => score.matchId == req.params.matchId
    );

    UpdateMatch.team1.players = await match.team1.players.map(
      (player) => {
        player.playerScoreList = player.playerScoreList.map((score) => {
          return score.matchId == req.params.matchId;
        });
        return player;
      }
    );
    
    UpdateMatch.team2.players = await match.team2.players.map(
      (player) => {
        player.playerScoreList = player.playerScoreList.map((score) => {
          return score.matchId == req.params.matchId;
        });
        return player;
      }
    );

    UpdateMatch.save();
    return res.status(200).json({
      status: true,
      message: "Player score updated successfully",
      match: UpdateMatch,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};
