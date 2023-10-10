

const Answer =  require("../models/Answer.js");
const Question = require("../models/Question.js");
const User = require("../models/User.js")

const newAnswer = async (req , res)=>{
    try{
    const {answer} = req.body;
    const questionId = req.params.questionId;
    const createdAnswer = new Answer({
        user : req.user._id,
        answer,
        question : questionId
    })


    await createdAnswer.save();

    await Question.findByIdAndUpdate(
        questionId,
        {
             $push: { answers: createdAnswer._id }
        },
        (err)=>{
            if(err) return res.status(400).send("Question could not be updated properly")
        }
    )


    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push : { answers : createdAnswer._id}
        },
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )

    

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
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.answerId);


    if(!deletedAnswer) return res.status(404).send("Invalid ID , answer does not exist");


    await Question.findByIdAndUpdate(
        deletedAnswer.question,
        {
            $pull : { answers : deletedAnswer._id}
        },
        (err)=>{
            if(err) return res.status(400).send("Question couldn't be updated properly")
        }
    )
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : { answers : deletedAnswer._id}
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


module.exports.newAnswer = newAnswer;
module.exports.getAnswer = getAnswer;
module.exports.updateAnswer = updateAnswer;
module.exports.deleteAnswer = deleteAnswer;
