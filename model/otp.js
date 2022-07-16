const mongoose = require('mongoose');

const otp = new mongoose.Schema({

    email:{
        type: String,
        required: true
    },code:{
        type: String,
        required: true
    },
    expireIn:{
        type: Number,
        required: true
    }
  
})



const Otp = mongoose.model('OTP',otp);

module.exports = Otp;