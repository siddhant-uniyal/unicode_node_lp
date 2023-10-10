const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user : { //user who posted this comment
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    parentType : {
        type : String,
        enum : ['Question' , 'Answer'], //on quora comments can be posted on questions or answers
        required : true
    },

    parentId : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : 'parentType', //use refPath for dynamic reference to parentType
        required : true
    },

    body : {
        type : String, //actual content of comment
        required : true
    },

    
    upvotes : { //array of ids of the users that have upvoted it
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },


    downvotes : { //array of ids of users who downvoted
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },




},
{
    timestamps : true
})


module.exports = mongoose.model("Comment" , schema);