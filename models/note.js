const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema ({ 
    title: {
        type: String,
        // required: true,
        default: "My note",
        max: 125
    },
    content: {
        type: String,
        max:255
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    userid: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model("Note", noteSchema);