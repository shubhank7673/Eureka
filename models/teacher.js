const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    courses:[
        {
            courseId:{
                type:Schema.Types.ObjectId,
                required:true
            },
            role:{
                type:String,
                required:true
            },
            batches:[
                {
                    type:String,
                    required:true
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Teacher',teacherSchema);