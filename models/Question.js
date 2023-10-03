const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user : { //id of the user who asked this question
        type : String,
        required : true
    },

    question : { //actual question asked
        type : String, 
        required : true
    },

    category : {
        type : [String]
    },

    answer : { // array of ids of the answers this question has recieved
        type : [String],
        
    },

    createdAt : { //time of creation
        type : Date,
        required : true
    },

    views : { //array of ids of the users who've viewed this question   
        type : [String],
       
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

    
})

module.exports = mongoose.model("Question" , schema)