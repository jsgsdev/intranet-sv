const mongoose = require("mongoose");

const EmailSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    }
})

module.exports = mongoose.model('Email', EmailSchema);