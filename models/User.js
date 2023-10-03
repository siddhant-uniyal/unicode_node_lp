const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique : true,
    },
    password:{
        type : String,
        required:true,
        select : false,
    },

    followers : {
        type : [String],
    },

    following : {
        type : [String],
    },

    answers : {
        type : [String],
    },

    questions : {
        type : [String],
    },

    views : {
        type : [String],
    },

    education : {
        type : String,
    },

    joinedAt:{
        type : Date,
        default : Date.now,
    },
})

module.exports = mongoose.model("User" , schema)

