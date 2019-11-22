const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    schedule:{
        date:{
            type:String,
            required:true
        },
        day:{
            type:String,
            required:true
        },
        month:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        }
    },
    venue:{
        type:String,
        // required:true
    },
    feedback:{
        starSum:Number,
        feedbackCnt:Number,
        comments:[]
    },
    inClassAct:[]
})

module.exports = mongoose.model('Class',classSchema);