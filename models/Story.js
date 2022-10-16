const mongoose = require('mongoose')
const User = require('./User')


const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: [ 'public', 'private' ]
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },

    createdAt: {
        type:Date,
        default:Date.now
    }
})


const Story = mongoose.model('Story', StorySchema)



module.exports =  Story 