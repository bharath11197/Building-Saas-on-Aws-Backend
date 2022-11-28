const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        maxlength:32,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    loginType:{
        type:String,
        enum : ['user','admin'],
        required:true
    },
    myFavourites: [{
        type: 'ObjectId',
        ref: "blog"
    }],
    token: {
        type: String,
        trim:true
    }
}, {timestamps: true})

module.exports = mongoose.model("user", userSchema)