
const User = require("../models/User.js")
const Question =  require("../models/Question.js");



export async function postQuestion(req , res){
    try{
    const {question , category} = req.body;

    const postedQuestion = new Question({
        question :question,
        category : category,
    })

    await postedQuestion.save();


    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push : { questions : postedQuestion._id}
        },
        // (err)=>{
        //     if(err) return res.status(400).send("User could not be updated successfully")
        // }
    )

    res.status(201).json({
        success : true,
        message : "Question posted successfully",
        postedQuestion
    })
}
catch(e){
    res.json({"Error" : e.message});
}

} 
export async function getQuestion(req , res ){
    
    try{

    const questions = await Question.find({user : req.user._id});

    res.status(200).json({
        success : true,
        questions,
    })
}
catch(e){
    res.json({
        "Error" : e.message
    });
}

} 
export async function updateQuestion(req , res){
    
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
export async function deleteQuestion(req , res ){
    try{
    const deletedQuestion = await Question.findById(req.params.questionId);

    if(!deletedQuestion) return res.status(404).send("Invalid ID , question does not exist");

    if(deletedQuestion.answers.length >= 1)return res.status(400).send("Sorry , you can't delete a question once you have recieved an answer");

    await deletedQuestion.remove();
    

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : { answers : deletedQuestion._id}
        },
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )
    

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

export async function upvoteQuestion(req , res){

    try{
        await Question.findByIdAndUpdate(
            req.params.questionId,
            {
                $push : {upvotes : req.user_id}
            }
        )
    }
    catch(err){
        return res.status(400).send("Question does not exist");
    }


    res.status(201).json({
        success : true,
        message : "Question upvoted successfully",
        

    })
}