
const express= require("express");
const { Answer } =  require("../models/Answer.js");



const newAnswer = async (req , res)=>{
    try{
    const {answer} = req.body;

    await Answer.create({
        user : req.user._id,
        answer,
        question : req.params.questionId,
        createdAt : Date.now(),
    })

    res.status(201).json({
        success : true,
        message : "Answer posted successfully",
    })
}
catch(e){
    console.error(e);
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
    console.error(e);
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
    

     res.status(201).send({
        success : true,
        message : "Answer Removed Successfully",
        deletedQuestion
} )

}
catch(e){
    console.error(e);
}
}


module.exports.newAnswer = newAnswer;
module.exports.getAnswer = getAnswer;
module.exports.updateAnswer = updateAnswer;
module.exports.deleteAnswer = deleteAnswer;
