// create a score card schema with history of every team

const mongoose = require('mongoose');

const ScoreCardSchema = new mongoose.Schema({ 
    team1Score:[
        {
            totalScore: {
                type: Number,
                default: 0,
            },
            overs:{
                type: Number,
                default: 0,
            },
            out:{
                type: Number,
                default: 0,
            },
            six:{
                type: Boolean,
                default: false,
            },
            four:{
                type: Boolean,
                default: false,
            },
            wicket:{
                type: Boolean,
                default: false,
            },
            videoStartTime: {
                type: Number,
            },
            videoEndTime: {
                type: Number,
            },
            player1ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            player1Score: { 
                type: Number,
            },
            player2ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            player2Score: { 
                type: Number,
            },
            ballerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            ballerScore: {
                type: Number,
            },
            highlights:{
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    team2Score:[
        {
            totalScore: {
                type: Number,
                default: 0,
            },
            overs:{
                type: Number,
                default: 0,
            },
            out:{
                type: Number,
                default: 0,
            },
            six:{
                type: Boolean,
                default: false,
            },
            four:{
                type: Boolean,
                default: false,
            },
            wicket:{
                type: Boolean,
                default: false,
            },
            videoStartTime: {
                type: Number,
            },
            videoEndTime: {
                type: Number,
            },
            player1ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            player1Score: { 
                type: Number,
            },
            player2ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            player2Score: { 
                type: Number,
            },
            ballerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            },
            ballerScore: {
                type: Number,
            },
            highlights:{
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ScoreCard', ScoreCardSchema);
