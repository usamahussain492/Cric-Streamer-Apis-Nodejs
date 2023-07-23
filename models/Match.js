// create a match of 2 circket Team
const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    team1: {
      _id: false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: [true, "Enter team1"],
      },
      onBatting: {
        type: Boolean,
        default: false,
      },
      onBolling: {
        type: Boolean,
        default: false,
      },
    },
    team2: {
        _id: false,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: [true, "Enter team1"],
          },
          onBatting: {
            type: Boolean,
            default: false,
          },
          onBolling: {
            type: Boolean,
            default: false,
          },
    },
    strictPopulate:false,
    // location: {
    //   type: String,
    //   required: [true, "Enter location"],
    // },
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "Enter userId"],
    // },
    // winner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Team",
    //   //required: [true, "Enter winner"]
    // },
    matchDate: {
      type: Date,
      default: Date.now,
    },
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

module.exports = mongoose.model("Match", MatchSchema);
