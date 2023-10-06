

const Question =  require("../models/Question.js");



const postQuestion = async (req , res)=>{
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
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )

    res.status(201).json({
        success : true,
        message : "Question posted successfully",
        newQuestion
    })
}
catch(e){
    res.json({"Error" : e.message});
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
    res.json({
        "Error" : e.message
    });
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


module.exports.postQuestion = postQuestion;
module.exports.getQuestion = getQuestion;
module.exports.updateQuestion = updateQuestion;
module.exports.deleteQuestion = deleteQuestion;
