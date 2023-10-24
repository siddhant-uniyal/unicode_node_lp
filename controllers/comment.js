

const Comment =  require("../models/Comment.js");
const Question = require("../models/Question.js");
const Comment = require("../models/Comment.js");


const newComment = async (req , res)=>{
    try{
    const {comment , parentType} = req.body;
    const parentId = req.params.parentId;
    const createdComment = new Comment({
        user : req.user._id,
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
        (err)=>{
            if(err) return res.status(400).send("Question could not be updated properly")
        }
    )
    }
    else{
        await Comment.findByIdAndUpdate(
            parentId,
            {
                 $push: { comment : createdComment._id }
            },
            (err)=>{
                if(err) return res.status(400).send("Comment could not be updated properly")
            }
        )
    }


    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push : { comments : createdComment._id}
        },
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )

    

    res.status(201).json({
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

    const comments = await Comment.find({user : req.user._id});

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

    if(!updatedComment) return res.status(404).send("Invalid ID , comment does not exist");

     res.status(201).send({
        success : true,
        message : "Comment Updated Successfully",
        updatedComment
    })
}catch(e){
    console.error(e);
}

    

}
const deleteComment = async (req , res )=>{
    try{
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);


    if(!deletedComment) return res.status(404).send("Invalid ID , comment does not exist");


    if(deletedComment.parentType=="Question"){
    await Question.findByIdAndUpdate(
        deletedComment.parentId,
        {
            $pull : { comments : deletedComment._id}
        },
        (err)=>{
            if(err) return res.status(400).send("Question couldn't be updated properly")
        }
    )
    }
    else{
        await Comment.findByIdAndUpdate(
            deletedComment.parentId,
            {
                $pull : { comments : deletedComment._id}
            },
            (err)=>{
                if(err) return res.status(400).send("Comment couldn't be updated properly")
            }
        )
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull : { comments : deletedComment._id}
        },
        (err)=>{
            if(err) return res.status(400).send("User could not be updated successfully")
        }
    )

    

     res.status(201).send({
        success : true,
        message : `Comment Removed Successfully , ${parentType} Updated Successfully and User updated Successfully`,
        deletedQuestion
} )

}
catch(e){
    res.json({
        "Error" : e.message
    });
}
}


module.exports = {newComment , getComment , updateComment , deleteComment};
