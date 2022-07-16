"use strict";

var mongoose = require('mongoose');

var otp = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  expireIn: {
    type: Number,
    required: true
  }
});
var Otp = mongoose.model('OTP', otp);
module.exports = Otp;