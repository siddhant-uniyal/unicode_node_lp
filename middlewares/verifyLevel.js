const isAdmin = async(req , res , next)=>{
    try{
        const userToVerify = await User.findById(req.user.user_id);

        if(userToVerify.auth === 'Normal'){
            req.auth = false;
        }
        else{
            req.auth = true;
        }
        next();
    }catch(err){
        return res.status(400).send(err.message);
    }
}

module.exports = isAdmin;