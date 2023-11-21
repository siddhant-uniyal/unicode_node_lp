const jwt = require("jsonwebtoken");
const isAuthenticated = async(req,res,next)=>{
    try{
        const authToken = req.header("authToken");
        if(!authToken){
            return res.status(401).send("Please Enter a valid authToken");
        }
        const user = await jwt.verify(authToken,process.env.JWT_SECRET);
        req.user = user;
        next();
    }catch(err){
        return res.status(400).send(err.message);
    }
}

module.exports = isAuthenticated;