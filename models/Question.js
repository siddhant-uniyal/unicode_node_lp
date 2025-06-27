const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user : { //id of the user who uploaded this question
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //i will refer to the User's in this field
      }, //so when a new question is uploaded , this field will be PATCHed to hold the value of req.user.user_id
  
    question : { //actual question asked
        type : String, 
        required : true
    },
    
    categories : {
        type : [String],
        enum : ['Science' , 'Philosophy' , 'Fashion' , 'Music' , 'Art' , 'Engineering' , 'Technology'], //add more
        required : true
    },


    answers : { // array of ids of the answers this question has recieved
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Answer',  //so in answer's createAnswer controller I will first make an Answer document and then
        //do a PATCH to the Question document that the answer was created for. that will be req.params.questionID in the createAnswer controller
    },
    



    views : { //array of ids of the users who've viewed this question   
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User',
    },



    upvotes : { //array of ids of the users that have upvoted it
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },


    downvotes : { //array of ids of users who downvoted
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },




    comments : { //array of ids of comments
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Comment'
    }


    
},
{
    timestamps : true
})

module.exports = mongoose.model("Question" , schema)