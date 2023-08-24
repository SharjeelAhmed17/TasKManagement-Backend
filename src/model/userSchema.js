const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema ({
    email:{
        type : String,
        unique : [true, 'User name exsist'],
        trim : true,
        lowecase : true,
        required: [true, 'User email is not provided'],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
            },
            message: 'is not a valid email address'
        }
    },
    fullName:{
        type : String,
        required : [true, 'Username is not provided']
    },
    password: {
        type: String,
        required:[true,'Please provide a password']
    },
    tasks : [{type:Schema.Types.ObjectId, ref: 'Task'}],
})

var taskSchema = new Schema({
    task : {
        type : String,
        required : [true, 'Please provide task']
    },
    status : {
        type : String,
        enum: ['To-do', 'In-progress', 'Completed'],
        required : [true, 'Please provide status']
    },
    user : {
        type:Schema.Types.ObjectId, 
        ref: 'User'
    },
})

var User = mongoose.model('User', userSchema);
var Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task }