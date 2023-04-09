const mongoose = require('mongoose');
const {format} = require('date-fns');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    githubID:String,
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },  
    password:{
        type:String,
        required:false
    },
    refreshToken:{
        type:String,
        default:''
    }
});
module.exports = mongoose.model('User', userSchema);