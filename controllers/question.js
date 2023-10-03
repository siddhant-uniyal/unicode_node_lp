
const express= require("express");
const { Question } =  require("../models/Question.js");



const newQuestion = async (req , res)=>{
    try{
    const {question , category} = req.body;

    const newQuestion = new Question({
        question :question,
        category : category,
        createdAt : Date.now(),

    })

    await newQuestion.save();

    res.json(newQuestion);

    res.status(201).json({
        success : true,
        message : "Question posted successfully",
    })
}
catch(e){
    console.error(e);
}

} 
const getQuestion = async (req , res )=>{
    
    try{

    const questions = await Question.find({user : req.user._id});

    res.status(200).json({
        success : true,
        questions,
    })
}
catch(e){
    console.error(e);
}

} 
const updateQuestion = async (req , res)=>{
    
    try{
    const updatedQuestion = await Question.findOneAndUpdate(
        {_id : req.params.questionId},
        req.body,
        {new : true}
    );

    if(!updatedQuestion) return res.status(404).send("Invalid ID , question does not exist");

     res.status(201).send({
        success : true,
        message : "Task Updated Successfully",
        updatedQuestion
    })
}catch(e){
    console.error(e);
}

    

}
const deleteQuestion = async (req , res )=>{
    try{
    const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);


    if(!deletedQuestion) return res.status(404).send("Invalid ID , question does not exist");
    

     res.status(201).send({
        success : true,
        message : "Question Removed Successfully",
        deletedQuestion
} )

}
catch(e){
    console.error(e);
}
}


module.exports.newQuestion = newQuestion;
module.exports.getQuestion = getQuestion;
module.exports.updateQuestion = updateQuestion;
module.exports.deleteQuestion = deleteQuestion;
