const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    zNumber: {
        type: String,
        required: true
    },
    profileImage: { // Changed field name
        type: String
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
    ],
    personalProfile: {
        type: String
    },
    gymProfile: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);