
const User = require("../models/User.js")
const Question =  require("../models/Question.js");



const postQuestion = async (req , res) => {
    try{
    const {question , category} = req.body;

    const postedQuestion = new Question({
        question :question,
        categories : category,
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

    res.status(200).json({
        success : true,
        message : "Question posted successfully",
        postedQuestion
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
const updateQuestion = async (req , res) => {
    
    try{
    const updatedQuestion = await Question.findOneAndUpdate(
        {_id : req.params.questionId},
        req.body,
        {new : true}
    );

    if(!updatedQuestion) return next(new ErrorHandler("Invalid ID , Question does not exist" , 400));
     res.status(201).send({
        success : true,
        message : "Question Updated Successfully",
        updatedQuestion
    })
}catch(e){
    console.error(e);
}

    

}
const deleteQuestion = async(req , res )=>{
    try{

    const questionToDelete = await Question.findById(req.params.questionId);

    if(!questionToDelete) return next(new ErrorHandler("Invalid ID , Question does not exist" , 400));

    const idOfUser = questionToDelete.user;

    if(req.user.user_id != idOfUser && req.auth == false ){
        next(new ErrorHandler("Only admins can delete questions of other users" , 400));
    }

    if(questionToDelete.answers.length >= 1)return next(new ErrorHandler("Sorry , you can't delete a question once it's been answered" , 401));

    await Question.deleteOne({ _id: req.params.questionId });
    

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : { answers : questionToDelete._id}
        },
        (err)=>{
            if(err) return next(new ErrorHandler("User could not be updated successfully" , 400));
        }
    )
    

     res.status(201).send({
        success : true,
        message : "Question Removed Successfully",
        questionToDelete
} )

}
catch(e){
    console.error(e);
}
}

const upvoteQuestion = async (req , res) => {

    try{
        await Question.findByIdAndUpdate(
            req.params.questionId,
            {
                $push : {upvotes : req.user_id}
            }
        )
    }
    catch(err){
        return next(new ErrorHandler("Question does not exist" , 400));
    }


    res.status(201).json({
        success : true,
        message : "Question upvoted successfully",
        

    })
}



const downvoteQuestion = async (req , res) => {

    try{

        const question = Question.findById(req.params.questionId);

        const hasUpvoted = question.upvotes.includes(req.user_id);
       
        await Question.findByIdAndUpdate(
            req.params.questionId,
            hasUpvoted ? { $pull: { upvotes: req.user_id }, $push: { downvotes: req.user_id } } : { $push: { downvotes: req.user_id} }
        )
    }
    catch(err){
        return next(new ErrorHandler("Invalid ID , Question does not exist" , 400));
    }


    res.status(201).json({
        success : true,
        message : "Question downvoted successfully",
        

    })
}


const searchCategory = async (req , res) => {
    const reqCategories = req.body.categories


    const result = [];

    for(const value of reqCategories){

        try {
            const data = await Question.find({ categories: { $in: reqCategories } });
            if(data){
                result.push(data);
            }
            else{
                return next(new ErrorHandler("Questions of this category could not be found" , 400));
            }
         } catch (err) {
            console.log(err);
         }
    }


    res.status(200).json({
        success : true,
        message : "Questions of desired categories found successfully",
        result

    })


}

module.exports = {getQuestion , postQuestion , deleteQuestion , upvoteQuestion , downvoteQuestion , updateQuestion , searchCategory}