const VerifyToken = require("../validation/verifyToken");
const Match = require("../models/Match");
const Team = require("../models/Team");
const Player = require("../models/Player");
const Image = require("../models/UploadImage")

// creating the controller for all matches
// @route GET api/match
// @desc get all matches
// @access Private
exports.getMatches = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const matches = await Match.find({});
    return res.status(200).json({
      status: true,
      message: "Matches fetched successfully",
      matches: matches,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for get match by id
// @route GET api/match/id
// @desc get match by id
// @access Private
exports.getMatchById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match fetched successfully",
      match: await Match.findById(req.params.id)
        .populate({
          path: "team1.id",
          populate: { path: "players", populate: "id",select:"name" },
        })
        .populate({
          path: "team2.id",
          populate: { path: "players", populate: "id",select:"name" },
        })
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for create match
// @route POST api/match
// @desc create match
// @access Private
exports.createMatch = async (req, res) => {
  try {
    if (!req.body.team1 || !req.body.team2) {
      return res.status(400).json({
        status: false,
        message: "Match team1, team2 are required",
      });
    }
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const match = await Match.create(req.body);

    await createScoreCard(match._id);

    return res.status(200).json({
      status: true,
      message: "Match created successfully",
      match: await Match.findById(match._id)
        .populate("team1.id")
        .populate("team2.id"),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for update match
// @route PUT api/match/id
// @desc update match
// @access Private
exports.updateMatch = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match updated successfully",
      match: match,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// deleting the controller for delete match
// @route DELETE api/match/id
// @desc delete match
// @access Private
exports.deleteMatch = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match deleted successfully",
      match: match,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for deleting all the matches
// @route DELETE api/match
// @desc delete all matches
// @access Private
exports.deleteAllMatches = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const matches = await Match.find({});
    if (!matches) {
      return res.status(400).json({
        status: false,
        message: "Matches not found",
      });
    }
    await Match.deleteMany({});
    return res.status(200).json({
      status: true,
      message: "Matches deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for getting the scoreCard of a match
// @route GET api/match/:id/scoreCard
// @desc get scoreCard of a match
// @access Private
exports.getScoreCard = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "ScoreCard fetched successfully",
      scoreCard: await getScoreCard(match._id, req, res),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for updating the scoreCard of a match
// @route PUT api/match/:id/scoreCard
// @desc update scoreCard of a match
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
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    
    const teamA = await Team.findById(match.team1.id);
    const teamB = await Team.findById(match.team2.id);
    if (match.team1.onBatting == true && match.team2.onBolling == true) {
      
      if(req.body.strikerId && req.body.newStrikerId ) {
        for(let player of teamA.players){
          if(player.id.toString() == req.body.strikerId){
            player.onStrike = false;
          }
          if(player.id.toString() == req.body.newStrikerId){
            player.onStrike = true;
          }
        }
      }
      await teamA.save();

      if (req.body.outPlayerId && req.body.newPlayerId && req.body.ballerId &&req.body.ball && (req.body.isOver == true ||req.body.isOver == false)) {
        teamA.players.forEach((player) => {
          // console.log("react to player",player.id.toString() == req.body.outPlayerId)
          if (player.id.toString() == req.body.outPlayerId) {
            player.isPlayed = true;
            player.onStrike = false;
            player.isBatting = false;
          }
          if (player.id.toString() == req.body.newPlayerId) {
            player.isBatting = true;
          }
        });
        if(req.body.ball.score>0){
         const updatedPlayer = await Player.findById(req.body.outPlayerId)
         for(let updateScore of updatedPlayer.playerBattingScore){
            if(updateScore.matchId.toString() == match._id.toString() && updateScore.teamId.toString() == teamA._id.toString()){
              updateScore.playerTotalScore += req.body.ball.score;
              updateScore.playerTotalBall += 1;
            }
         }
         await updatedPlayer.save(); 
        }
        for(let score of teamA.teamScoreList){
          if(score.matchId.toString() === match._id.toString()){
            score.out +=1;
            if(score.overs.length == 0){
              score.overs.push([]);
            }
           
            score.overs[score.overs.length - 1].push(req.body.ball);
            score.totalScore += req.body.ball.score;
           
            if (req.body.isOver) {
              score.overs.push([]);
            }
          }
        }
        await teamA.save();
        teamB.players.forEach(async (player) => {
          if (player.id.toString() == req.body.ballerId && player.isBowling) {
            const updateBaller = await Player.findById(player.id)
            updateBaller.playerBowlingScore.forEach(async(playerScore) => {
              if (
                playerScore.matchId.toString() == match._id.toString() &&
                playerScore.teamId.toString() == teamB._id.toString()
              ) {
                
                  playerScore.wickets += 1;
                  playerScore.overs = playerScore.overs + 1
                  await updateBaller.save()
              }
            });
          }
        });
        await teamB.save()
      }
      
      if (
        req.body.ball != {} &&
        (req.body.isOver == true ||req.body.isOver == false)&&
        req.body.extra >= 0 &&
        req.body.strikerId != ""&&
        req.body.ballerId != ""
      ) {
        // console.log("ball", req.body.ball);
        teamA.teamScoreList.forEach((item) => {
          if (item.matchId.toString() == match._id.toString()) {
            if (req.body.extra > 0) {
              item.extra += req.body.extra;
              item.totalScore += req.body.extra;
            } else {
              // console.log(item.overs.length)
              if(item.overs.length == 0){
                item.overs.push([]);
              }
             
              item.overs[item.overs.length - 1].push(req.body.ball);
              item.totalScore += req.body.ball.score;
             
              if (req.body.isOver) {
                item.overs.push([]);
              }
            }
            teamA.players.forEach(async (player) => {
              // console.log("strikerId", player.id.toString() == req.body.strikerId);
              if (player.id.toString() == req.body.strikerId) {
                const updatePlayer = await Player.findById(player.id);
                updatePlayer.playerBattingScore.forEach(async(playerScore) => {
                  if (
                    playerScore.matchId.toString() == match._id.toString() &&
                    playerScore.teamId.toString() == teamA._id.toString()
                  ) {
                    if (req.body.extra > 0) {
                      playerScore.playerTotalScore += req.body.extra;
                    } else {
                      playerScore.playerTotalBall += 1;
                      playerScore.playerTotalScore += req.body.ball.score;
                    }
                  }
                  await updatePlayer.save();
                });

              } 
            });
          }
        });
        teamB.players.forEach(async (player) => {
          if (player.isBowling) {
            const updateBaller = await Player.findById(player.id);
            updateBaller.playerBowlingScore.forEach((playerScore) => {
              if (
                playerScore.matchId.toString() == match._id.toString() &&
                playerScore.teamId.toString() == teamB._id.toString()
              ) {
                if (req.body.extra > 0) {
                  playerScore.score += req.body.ball.score;
                  if (req.body.outPlayerId) {
                    playerScore.wickets += 1;
                  }
                } else {
                  playerScore.overs = playerScore.overs + 1
                  playerScore.score += req.body.ball.score;
                  if (req.body.outPlayerId) {
                    playerScore.wickets += 1;
                  }
                }
              }
            });
            await updateBaller.save();
          }
        });
        await teamA.save();
        await teamB.save();
      }
      if (req.body.strikers) {
        for(let player of teamA.players){
          if(player.id.toString() == req.body.strikers[0]){
            player.isBatting = true;
            player.onStrike = true;
            player.isBowling = false;
          } else if(player.id.toString() == req.body.strikers[1]){
            player.isBatting = true;
            player.onStrike = false;
            player.isBowling = false;
          }
          else{
            player.isBatting = false;
            player.onStrike = false;
            player.isBowling = false;
          }
        }
        await teamA.save();
      }
      await teamA.save();

      if (req.body.newBallerId) {
        teamB.players.forEach(async (player) => {
          if (player.id.toString() == req.body.newBallerId) {
            player.isBowling = true;
          } else {
            player.isBowling = false;
          }
        });
      }
      await teamB.save();
    } else if (match.team1.onBolling == true && match.team2.onBatting == true) {
      
      if(req.body.strikerId && req.body.newStrikerId ) {
        for(let player of teamB.players){
          if(player.id.toString() == req.body.strikerId){
            player.onStrike = false;
          }
          if(player.id.toString() == req.body.newStrikerId){
            player.onStrike = true;
          }
        }
      }
      await teamB.save();

      
      if (req.body.outPlayerId && req.body.newPlayerId && req.body.ballerId &&req.body.ball && (req.body.isOver == true ||req.body.isOver == false)) {
        teamB.players.forEach((player) => {
          // console.log("react to player",player.id.toString() == req.body.outPlayerId)
          if (player.id.toString() == req.body.outPlayerId) {
            player.isPlayed = true;
            player.onStrike = false;
            player.isBatting = false;
          }
          if (player.id.toString() == req.body.newPlayerId) {
            player.isBatting = true;
          }
        });
        if(req.body.ball.score>0){
         const updatedPlayer = await Player.findById(req.body.outPlayerId)
         for(let updateScore of updatedPlayer.playerBattingScore){
            if(updateScore.matchId.toString() == match._id.toString() && updateScore.teamId.toString() == teamB._id.toString()){
              updateScore.playerTotalScore += req.body.ball.score;
              updateScore.playerTotalBall += 1;
            }
         }
         await updatedPlayer.save(); 
        }
        for(let score of teamB.teamScoreList){
          if(score.matchId.toString() === match._id.toString()){
            score.out +=1;
            if(score.overs.length == 0){
              score.overs.push([]);
            }
           
            score.overs[score.overs.length - 1].push(req.body.ball);
            score.totalScore += req.body.ball.score;
           
            if (req.body.isOver) {
              score.overs.push([]);
            }
          }
        }
        await teamB.save();
        teamA.players.forEach(async (player) => {
          if (player.id.toString() == req.body.ballerId && player.isBowling) {
            const updateBaller = await Player.findById(player.id)
            updateBaller.playerBowlingScore.forEach(async(playerScore) => {
              if (
                playerScore.matchId.toString() == match._id.toString() &&
                playerScore.teamId.toString() == teamA._id.toString()
              ) {
                
                  playerScore.wickets += 1;
                  playerScore.overs = playerScore.overs + 1
                  await updateBaller.save()
              }
            });
          }
        });
        await teamA.save()
      }

      if (
        req.body.ball != {} &&
        (req.body.isOver == true ||req.body.isOver == false)&&
        req.body.extra >= 0 &&
        req.body.strikerId != ""&&
        req.body.ballerId != ""
      ) {
        // console.log("ball", req.body.ball);
        teamB.teamScoreList.forEach((item) => {
          if (item.matchId.toString() == match._id.toString()) {
            if (req.body.extra > 0) {
              item.extra += req.body.extra;
              item.totalScore += req.body.extra;
            } else {
              // console.log(item.overs.length)
              if(item.overs.length == 0){
                item.overs.push([]);
              }
             
              item.overs[item.overs.length - 1].push(req.body.ball);
              item.totalScore += req.body.ball.score;
             
              if (req.body.isOver) {
                item.overs.push([]);
              }
            }
            teamB.players.forEach(async (player) => {
              // console.log("strikerId", player.id.toString() == req.body.strikerId);
              if (player.id.toString() == req.body.strikerId) {
                const updatePlayer = await Player.findById(player.id);
                updatePlayer.playerBattingScore.forEach(async(playerScore) => {
                  if (
                    playerScore.matchId.toString() == match._id.toString() &&
                    playerScore.teamId.toString() == teamB._id.toString()
                  ) {
                    if (req.body.extra > 0) {
                      playerScore.playerTotalScore += req.body.extra;
                    } else {
                      playerScore.playerTotalBall += 1;
                      playerScore.playerTotalScore += req.body.ball.score;
                    }
                  }
                  await updatePlayer.save();
                });
               await updatePlayer.save();

              } 
            });
          }
        });
        teamA.players.forEach(async (player) => {
          if (player.isBowling) {
            const updateBaller = await Player.findById(player.id);
            updateBaller.playerBowlingScore.forEach((playerScore) => {
              if (
                playerScore.matchId.toString() == match._id.toString() &&
                playerScore.teamId.toString() == teamA._id.toString()
              ) {
                if (req.body.extra > 0) {
                  playerScore.score += req.body.ball.score;
                  if (req.body.outPlayerId) {
                    playerScore.wickets += 1;
                  }
                } else {
                  playerScore.overs = playerScore.overs + 1
                  playerScore.score += req.body.ball.score;
                  if (req.body.outPlayerId) {
                    playerScore.wickets += 1;
                  }
                }
              }
            });
            await updateBaller.save();
          }
        });
        await teamB.save();
        await teamA.save();
      }
      if (req.body.strikers) {
        // console.log(req.body.strikers)
        for(let player of teamB.players){
          if(player.id.toString() == req.body.strikers[0]){
            player.isBatting = true;
            player.onStrike = true;
            player.isBowling = false;
          } else if(player.id.toString() == req.body.strikers[1]){
            player.isBatting = true;
            player.onStrike = false;
            player.isBowling = false;
          }
          else{
            player.isBatting = false;
            player.onStrike = false;
            player.isBowling = false;
          }
        }
        await teamB.save();
       
        
      }
      await teamB.save();
      

      if (req.body.newBallerId) {
        teamA.players.forEach(async (player) => {
          if (player.id.toString() == req.body.newBallerId) {
            player.isBowling = true;
          } else {
            player.isBowling = false;
          }
        }); 
      }
      await teamA.save();
    }
    if (req.body.isInningOver) {
      match.team1.onBatting = !match.team1.onBatting;
      match.team1.onBolling = !match.team1.onBolling;

      match.team2.onBolling = !match.team2.onBolling;
      match.team2.onBatting = !match.team2.onBatting;

      await match.save();
    }
    return res.status(200).json({
      status: true,
      message: "Score Card Updated successfully",
      scoreCard: await getScoreCard(match._id, req, res),
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

async function getScoreCard(matchId, req, res) {
  const match = await Match.findById(matchId);

  const teamA = await Team.findById(match.team1.id);
  const teamB = await Team.findById(match.team2.id);
  let scoreCard = {};

  if (match.team1.onBatting == true && match.team2.onBolling == true) {
    scoreCard.battingTeam = [];
    for(let score of teamA.teamScoreList) {
      if (score.matchId.toString() === match._id.toString()) {
        scoreCard.battingTeam.push({
          name: teamA.name,
          image: await Image.findById(teamA.image),
          score,
        });
      }
    }

    scoreCard.ballingTeam = []
    scoreCard.ballingTeam.push({
      name: teamB.name,
      image: await Image.findById(teamB.image)
    });

    scoreCard.players = [];
    for (let TeamPlayer in teamA.players) {
      if (teamA.players[TeamPlayer].isBatting) {
        await Player.findById(teamA.players[TeamPlayer].id.toString()).then(
          (player) => {
            for (let playerScore in player.playerBattingScore) {
              if (
                player.playerBattingScore[playerScore].matchId.toString() ==
                  match._id.toString() &&
                player.playerBattingScore[playerScore].teamId.toString() ==
                  teamA._id.toString()
              ) {
                scoreCard.players.push({
                  id: player._id,
                  name: player.name,
                  score: player.playerBattingScore[playerScore],
                  isBatting: teamA.players[TeamPlayer].isBatting,
                  onStrike: teamA.players[TeamPlayer].onStrike,
                });
              }
            }
          }
        );
      }
    }

    scoreCard.baller = [];
    for (let TeamPlayer in teamB.players) {
      if (teamB.players[TeamPlayer].isBowling) {
        await Player.findById(teamB.players[TeamPlayer].id.toString()).then(
          (player) => {
            for (let playerScore in player.playerBowlingScore) {
              if (
                player.playerBowlingScore[playerScore].matchId.toString() ==
                  match._id.toString() &&
                player.playerBowlingScore[playerScore].teamId.toString() ==
                  teamB._id.toString()
              ) {
                scoreCard.baller.push({
                  id: player._id,
                  name: player.name,
                  score: {
                    score: player.playerBowlingScore[playerScore].score,
                    wickets: player.playerBowlingScore[playerScore].wickets,
                    overs: Math.round((player.playerBowlingScore[playerScore].overs/6)*10)/10,
                  }
                });
              }
            }
          }
        );
      }
    }

    scoreCard.remainingPlayers = [];
    teamA.players.forEach(async (TeamPlayer) => {
      if (TeamPlayer.isPlayed == false) {
        scoreCard.remainingPlayers.push(TeamPlayer);
      }
    });
    scoreCard.allBallers = teamB.players;
  } else if (match.team2.onBatting == true && match.team1.onBolling == true) {
    scoreCard.battingTeam = [];
    for(let score of teamB.teamScoreList) {
      if (score.matchId.toString() === match._id.toString()) {
        scoreCard.battingTeam.push({
          name: teamA.name,
          image: await Image.findById(teamA.image),
          score,
        });
      }
    }
    scoreCard.ballingTeam = []
    scoreCard.ballingTeam.push({
      name: teamA.name,
      image: await Image.findById(teamA.image)
    });
    scoreCard.players = [];
    for (let TeamPlayer in teamA.players) {
      if (teamB.players[TeamPlayer].isBatting) {
        await Player.findById(teamB.players[TeamPlayer].id.toString()).then(
          (player) => {
            for (let playerScore in player.playerBattingScore) {
              if (
                player.playerBattingScore[playerScore].matchId.toString() ==
                  match._id.toString() &&
                player.playerBattingScore[playerScore].teamId.toString() ==
                  teamB._id.toString()
              ) {
                scoreCard.players.push({
                  id: player._id,
                  name: player.name,
                  score: player.playerBattingScore[playerScore],
                  isBatting: teamB.players[TeamPlayer].isBatting,
                  onStrike: teamB.players[TeamPlayer].onStrike,
                });
              }
            }
          }
        );
      }
    }

    // await teamB.players.forEach(async (TeamPlayer) => {
    //   if (TeamPlayer.isBatting == true) {
    //     await Player.findById(TeamPlayer.id).then(async (player) => {
    //       await player.playerBattingScore.forEach((playerScore) => {
    //         if (
    //           playerScore.matchId.toString() == match._id.toString() &&
    //           playerScore.teamId.toString() == teamA._id.toString()
    //         ) {
    //           scoreCard.players.push( {
    //             id: player._id,
    //             name: player.name,
    //             role: player.role,
    //             cnic: player.cnic,
    //             score: playerScore,
    //             playerBattingScore: playerScore,
    //           })
    //         }
    //       });
    //     });
    //   }
    // });
    scoreCard.baller = [];
    for (let TeamPlayer in teamA.players) {
      if (teamA.players[TeamPlayer].isBowling) {
        await Player.findById(teamA.players[TeamPlayer].id.toString()).then(
          (player) => {
            for (let playerScore in player.playerBowlingScore) {
              if (
                player.playerBowlingScore[playerScore].matchId.toString() ==
                  match._id.toString() &&
                player.playerBowlingScore[playerScore].teamId.toString() ==
                  teamA._id.toString()
              ) {
                scoreCard.baller.push({
                  id: player._id,
                  name: player.name,
                  score: player.playerBowlingScore[playerScore],
                });
              } 
            }
          }
        );
      }
    }
    scoreCard.remainingPlayers = [];
    await teamB.players.map(async (TeamPlayer) => {
      if (TeamPlayer.isPlayed == false) {
        scoreCard.remainingPlayers.push(TeamPlayer);
      }
    });
    scoreCard.allBallers = teamA.players;
  } else {
    return scoreCard;
  }
  return scoreCard;
}

async function createScoreCard(matchId) {
  const match = await Match.findById(matchId);
  const teamA = await Team.findById(match.team1.id);
  const teamB = await Team.findById(match.team2.id);

  teamA.teamScoreList.push({ matchId: match._id });

  teamA.players.forEach(async (player) => {
    await Player.findByIdAndUpdate(player.id).then(async (updatePlayer) => {
      updatePlayer.playerBattingScore.push({
        matchId: matchId,
        teamId: teamA._id,
      });
      updatePlayer.playerBowlingScore.push({
        matchId: matchId,
        teamId: teamA._id,
      });
      await updatePlayer.save();
    });
  });
  await teamA.save();
  teamB.teamScoreList.push({ matchId: match._id });
  teamB.players.forEach(async (player) => {
    await Player.findByIdAndUpdate(player.id).then(async (updatePlayer) => {
      updatePlayer.playerBattingScore.push({
        matchId: matchId,
        teamId: teamB._id,
      });
      updatePlayer.playerBowlingScore.push({
        matchId: matchId,
        teamId: teamB._id,
      });
      await updatePlayer.save();
    });
  });
  await teamB.save();
}
