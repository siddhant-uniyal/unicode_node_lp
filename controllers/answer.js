

const Answer =  require("../models/Answer.js");
const Question = require("../models/Question.js");
const User = require("../models/User.js")

const newAnswer = async (req , res)=>{
    try{
    const {answer} = req.body;
    const questionId = req.params.questionId;
    const createdAnswer = new Answer({
        user : req.user.user_id,
        answer,
        question : questionId
    })


    await createdAnswer.save();

    try {
        await Question.findByIdAndUpdate(
          questionId,
          {
            $push: { answers: createdAnswer._id }
          }
        );
      } catch(err) {
        return res.status(400).send("Question could not be updated properly");
      }


      try {
        await User.findByIdAndUpdate(
          req.user.user_id,
          {
            $push: { answers: createdAnswer._id }
          }
        );
      } catch(err) {
        return res.status(400).send("User could not be updated properly");
      }


    

    res.status(201).json({
        success : true,
        message : "Answer posted successfully ,Question document updated successfully and User updated Successfully",
        createdAnswer

    })
}
catch(e){
    res.json({
        "Error" : e.message
    });
}

} 
const getAnswer = async (req , res )=>{
    
    try{

    const answers = await Answer.find({user : req.user._id});

    res.status(200).json({
        success : true,
        answers,
    })
}
catch(e){
    res.json({
        "Error" : e.message
    });
}

} 
const updateAnswer = async (req , res)=>{
    
    try{
    const updatedAnswer = await Answer.findOneAndUpdate(
        {_id : req.params.answerId},
        req.body,
        {new : true}
    );

    if(!updatedAnswer) return res.status(404).send("Invalid ID , answer does not exist");

     res.status(201).send({
        success : true,
        message : "Answer Updated Successfully",
        updatedAnswer
    })
}catch(e){
    console.error(e);
}

    

}
const deleteAnswer = async (req , res )=>{
    try{

    const answerToDelete = await Answer.findById(req.params.answerId);

    if(!answerToDelete) return res.status(404).send("Invalid ID , answer does not exist");
    
    const idOfUser = answerToDelete.user;


    if(req.user.user_id != idOfUser && req.auth == false ){
        return res.status(404).send("Only admins can delete answers of other users");
    }

    await answerToDelete.remove();


    await Question.findByIdAndUpdate(
        answerToDelete.question,
        {
            $pull : { answers : answerToDelete._id}
        },
        (err)=>{
            if(err) return res.status(400).send("Question couldn't be updated properly")
        }
    )
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : { answers : answerToDelete._id}
        },
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )

    

     res.status(201).send({
        success : true,
        message : "Answer Removed Successfully ,Question Updated Successfully and User updated Successfully",
        deletedQuestion
} )

}
catch(e){
    res.json({
        "Error" : e.message
    });
}
}


const upvoteAnswer = async(req , res)=>{
    try{
        await Answer.findByIdAndUpdate(
            req.params.answerId,
            {
                $push : {upvotes : req.user_id}
            }
        )
    }
    catch(err){
        return res.status(400).send("Answer does not exist");
    }


    res.status(201).json({
        success : true,
        message : "Answer upvoted successfully",
        

    })
}


const downvoteAnswer = async (req , res) => {

    try{

        const answer = Answer.findById(req.params.answerId);

        const hasUpvoted = answer.upvotes.includes(req.user_id);
       
        await Answer.findByIdAndUpdate(
            req.params.answerId,
            hasUpvoted ? { $pull: { upvotes: req.user_id }, $push: { downvotes: req.user_id } } : { $push: { downvotes: req.user_id} }
        )
    }
    catch(err){
        return res.status(400).send("Answer does not exist");
    }


    res.status(201).json({
        success : true,
        message : "Answer downvoted successfully",
        

    })
}




module.exports = {newAnswer , getAnswer , updateAnswer , deleteAnswer , upvoteAnswer , downvoteAnswer};