const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user : { //id of the user who posted this answer
        type : String,
        required : true
    },

    question : { //array of id(s) of the question(s) that it is an answer to (same answer can be posted for multiple questions)
        type : [String], 
        required : true
    },

    answer : { // actual answer content
        type : String,
        required : true
    },

    createdAt : { //time of creation
        type : Date,
        required : true
    },

    views : { //array of ids of the users who've viewed this answer
        type : [String],
        required : true
    },

    upvotes : { //array of ids of the users that have upvoted it
        type : [String],
    },

    downvotes : { //array of ids of users who downvoted
        type : [String],
    },

    comments : { //array of ids of comments
        type : [String],
    },

    shares : { //array of ids of users who shared this
        type : [String],
    }

})

module.exports = mongoose.model("Answer" , schema)