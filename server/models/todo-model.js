const mongoose = require("mongoose");

const todo = new mongoose.Schema({
    task: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model("Todo", todo);