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
            ref:'Teacher',
            required:true
        },
        name:{
            type:String,
            required:true
        },
        role:{

        },
        batches:[]
    }],
    batches:[{
            name:{
            type:String,
            require:true
        }
    }],
    classes:[{
        class:{
            classId:{
                type:Schema.Types.ObjectId,
                ref:'Class',
                require:true
            },
            title:{
                type:String,
                require:true    
            },
            timing:{
                type:String,
                require:true
            },
            date:{
                type:String,
                require:true
            },
            month:{
                type:String,
                require:true
            },
            day:{
                type:String,
                require:true
            }
        },
        batch:{
            type:String,
            require:true
        }
    }],
    courseTextbooks:[{
        name:{
            type:String,
            required:true
        },
        author:{
            type:String,
            required:true
        }
    }],
    courseReferences:[]
})

module.exports = mongoose.model('Course',courseSchema);