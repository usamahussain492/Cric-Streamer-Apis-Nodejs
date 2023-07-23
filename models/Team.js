// create a schema for circket team having 12 player in a team

const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter team name"],
    },
    image: {
      type: String,
      required: [true, "Enter team image"],
    },
    logo: {
      type: String,
      required: [true, "Enter team logo"],
    },
    city: {
      type: String,
    },
    slogan: {
      type: String,
    },
    players: [
      {
        _id: false,
        id: {
          type: mongoose.Schema.ObjectId,
          ref: "Player",
        },
        isCaptain: {
          type: Boolean,
          default: false,
        },
        isPlayed:{
          type: Boolean,
          default: false,
        },
        onStrike: {
          type: Boolean,
          default: false,
        },
        isBatting: {
          type: Boolean,
          default: false,
        },
        isBowling: {
          type: Boolean,
          default: false,
        },
      },
    ],
    
    teamScoreList: [
      {
        _id: false,
        matchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Match",
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        out: {
          type: Number,
          default: 0,
        },
        extra: {
          type: Number,
          default: 0,
        },
        overs: [
          [ // no of overs
            { // per ball
              _id: false,
              score: {
                type: Number,
                default: 0,
              },
              text: {
                type: String,
                default: "",
              }
            }
          ]
        ],
      },
    ],
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", TeamSchema);
