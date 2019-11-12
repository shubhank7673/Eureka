const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    problems:[{
        statement:{
            type:String,
            required:true
        },
        options:[],
        correct:{
            type:Number,
            required:true
        },
        responses:[{
            student:{
                type:Schema.Types.ObjectId,
                ref:'Student'
            },
            response:{
             type:Number   
            }
        }]
    }],

})

module.exports = mongoose.model('Quiz',quizSchema);