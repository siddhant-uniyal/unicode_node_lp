const Comment =  require("../models/Comment.js");
const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const User = require("../models/User.js");
const ErrorHandler = require("../utils/errorHandler.js");



const newComment = async (req , res)=>{
    try{
    const {comment , parentType} = req.body;
    const parentId = req.params.parentId;
    const createdComment = new Comment({
        user : req.user.user_id,
        comment,
        parentId,
        parentType
    })


    await createdComment.save();


    if(parentType=="Question"){
    await Question.findByIdAndUpdate(
        parentId,
        {
             $push: { comments : createdComment._id }
        },
        // (err)=>{
        //     if(err) return next(new ErrorHandler("Question could not be updated properly" , 400));
        // }
    )
    }
    else{
        await Answer.findByIdAndUpdate(
            parentId,
            {
                 $push: { comments : createdComment._id }
            },
            // (err)=>{
            //     if(err) return res.status(400).send("Comment could not be updated properly")
            // }
        )
    }


    await User.findByIdAndUpdate(
        req.user.user_id,
        {
            $push : { comments : createdComment._id}
        },
        // (err)=>{
        //     if(err) return next(new ErrorHandler("User could not be updated successfully" , 400));
        // }
    )

    

    res.status(200).json({
        success : true,
        message : `Comment posted successfully , ${parentType} document updated successfully and User updated Successfully`,
        createdComment

    })
}
catch(e){
    res.json({
        "Error" : e.message
    });
}

} 
const getComment = async (req , res )=>{
    
    try{

    const comments = await Comment.find({user : req.user.user_id});

    res.status(200).json({
        success : true,
        comments,
    })
}
catch(e){
    res.json({
        "Error" : e.message
    });
}

} 
const updateComment = async (req , res)=>{
    
    try{
    const updatedComment = await Comment.findOneAndUpdate(
        {_id : req.params.commentId},
        req.body,
        {new : true}
    );

    if(!updatedComment) return next(new ErrorHandler("Invalid ID , Comment does not exist" , 400));

     res.status(201).send({
        success : true,
        message : "Comment Updated Successfully",
        updatedComment
    })
}catch(e){
    console.error(e);
}

    

}
const deleteComment = async (req , res , next )=>{
    try{

    const commentToDelete = await Comment.findById(req.params.commentId);

    if(!commentToDelete) return next(new ErrorHandler("Invalid ID , Comment does not exist" , 404));

    const idOfUser = commentToDelete.user;

    if(req.user.user_id != idOfUser && req.auth == false ){
        return next(new ErrorHandler("Only admins can delete comments of other users" , 401));
    }


    await Comment.deleteOne({ _id: req.params.commentId });

    const parentType = commentToDelete.parentType
    if(parentType=="Question"){
    await Question.findByIdAndUpdate(
        commentToDelete.parentId,
        {
            $pull : { comments : commentToDelete._id}
        },
        // (err)=>{
        //     if(err) return next(new ErrorHandler("Question could not be updated properly" , 400));
        // }
    )
    }
    else{
        await Answer.findByIdAndUpdate(
            commentToDelete.parentId,
            {
                $pull : { comments : commentToDelete._id}
            },
            // (err)=>{
            //     if(err) return next(new ErrorHandler("Comment could not be updated properly" , 400));
            // }
        )
    }
    await User.findByIdAndUpdate(
        req.user.user_id,
        {
            $pull : { comments : commentToDelete._id}
        },
        // (err)=>{
        //     if(err) return next(new ErrorHandler("User could not be updated properly" , 400));
        // }
    )

    

     res.status(201).send({
        success : true,
        message : `Comment Removed Successfully , ${parentType} Updated Successfully and User updated Successfully`,
        commentToDelete
} )

}
catch(e){
    res.json({
        "Error" : e.message
    });
}
}



const upvoteComment = async(req , res)=>{
    try{
        await Comment.findByIdAndUpdate(
            req.params.answerId,
            {
                $push : {upvotes : req.user_id}
            }
        )
    }
    catch(err){
        return next(new ErrorHandler("Comment does not exist" , 400));
    }


    res.status(201).json({
        success : true,
        message : "Comment upvoted successfully",
        

    })
}


const downvoteComment = async (req , res , next) => {

    try{

        const comment = await Comment.findById(req.params.commentId);

        const hasUpvoted = comment.upvotes.includes(req.user_id);
       
        await Comment.findByIdAndUpdate(
            req.params.answerId,
            hasUpvoted ? { $pull: { upvotes: req.user_id }, $push: { downvotes: req.user_id } } : { $push: { downvotes: req.user_id} }
        )
    }
    catch(err){
        return next(new ErrorHandler("Comment does not exist" , 400));
    }


    res.status(201).json({
        success : true,
        message : "Comment downvoted successfully",
        

    })
}



module.exports = {newComment , getComment , updateComment , deleteComment , upvoteComment , downvoteComment};
