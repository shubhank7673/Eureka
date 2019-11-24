const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startTime:{
        type: Date
    },
    duration: {
    },
    problems: [{
        statement: {
            type: String,
            required: true
        },
        options: [],
        correct: [{
            type: String,
            required: true
        }]
    }],
    responses: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        response: []
    }],
    isFinish:{
        type: Boolean,
        required: true
    },
    maxOptions:{
        type:Number
    }
})

module.exports = mongoose.model('Quiz', quizSchema);