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
        type: Number,
        required: true
    },
    problems: [{
        statement: {
            type: String,
            // required: true
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
    },
    responses: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        response:[]
    }],
    summaryPresent: {
        type: Boolean
    },
    summary: {
        avgClassScore: {
            type: Number
        },
        minScore: {
            type: Number
        },
        maxScore: {
            type: Number
        },
        studentsPerf: [{
            studentId: {
                type: Schema.Types.ObjectId,
                ref: 'Student'
            },
            score: {
                type: Number
            }
        }]
    }
})

module.exports = mongoose.model('Quiz', quizSchema);