const mongoose = require('mongoose')

const OtpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        index:{expires:120}
    }
},{
    timestamps: true
    })

module.exports = mongoose.model('Otp', OtpSchema)