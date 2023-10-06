const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: { //id for the user who uploaded this answer
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //in createAnswer controller , i will put req.user._id which came from isAuth() middleware
        required : true
      },

    question : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Question',
        required : true //in createAnswer controller , i will put req.params.questionID in this field
    },

    answer : { // actual answer content
        type : String,
        required : true
    },


    views : { //array of ids of the users who've viewed this answer
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
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
        ref : 'User'
    },

    shares : { //array of ids of users who shared this
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    }

},
{timestamps:true})

module.exports = mongoose.model("Answer" , schema)