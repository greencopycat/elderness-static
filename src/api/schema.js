const mongoose = require('mongoose')
const wisdom = new mongoose.Schema({
    advice: {
        type: String,
        required: true
    }
})

module.exports = new mongoose.model('Wisdom', wisdom)