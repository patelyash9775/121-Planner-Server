const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const meetingSchema = new mongoose.Schema({

    sender:{
        type: String,
        required: true
    },username:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    restaurant:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    condition:{
        type: String,
        required: true
    }

  
})



const Schedule = mongoose.model('MEETING',meetingSchema);

module.exports = Schedule;