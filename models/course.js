const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName:{
        type:String,
        required:true
    },
    courseCode:{
        type:String,
        required:true
    },
    courseAdmin:{
        type:Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
    },
    courseTeam:[{
        techer:{
            type:Schema.Types.ObjectId,
            ref:'Teacher'
        }
    }],
    batches:[{
            name:{
            type:String,
            require:true
        }
    }],
    classes:[{
        class:{
            type:Schema.Types.ObjectId,
            ref:'Class',
            require:true
        },
        batch:{
            type:String,
            require:true
        }
    }]
})

module.exports = mongoose.model('Course',courseSchema);