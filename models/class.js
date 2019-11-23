const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    schedule: {
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    venue: {
        type: String,
        required: true
    },
    feedback: {
        starSum: Number,
        feedbackCnt: Number,
        comments: []
    },
    inClassAct: {
        quiz: [{
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        }],
        // poll: [{
        //     type: Schema.Types.ObjectId,
        //     ref: 'Poll',
        //     required: true
        // }]
    }
});

module.exports = mongoose.model('class', classSchema);
