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
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'  //since , users will follow other users
    },

    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'

    },

    answers : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Answer'  //this field has all the answers that are associated with this user. everytime an answer is created , i will PATCH this
        //field to contain the answer document id
    },

    questions : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Question' //same logic as above
    },

    comments : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Comment'
    },

    views : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },

    education : {
        type : String,
    }
},{
    timestamps : true
})

module.exports = mongoose.model("User" , schema)

