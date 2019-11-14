const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type: String
    },
    email:{
        type:String,
        required:true
    },
    university:{
        type:String,
        required:true
    },
    batch:{
        type:String,
        // required:true
    },
    courses:[{
            course:{
                type:Schema.Types.ObjectId,
                ref:'Course'
            },
            analytics:{
                avgQuizSc:{
                    type:Schema.Types.Decimal128,
                    // require:true
                },
                noQuizAtt:{
                    type:Number,
                    // require:true
                },
                noPollAtt:{
                    type:Number,
                    // require:true
                }
            }
    }]
})

module.exports = mongoose.model('Student',studentSchema);