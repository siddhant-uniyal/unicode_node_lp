const {app} = require("./app.js")

const {connectToDB} =require("./data/db.js")

const cloudinary = require("cloudinary").v2



connectToDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
  


app.get("/" , (req , res)=>{
    res.send("site is working")
})
app.listen(process.env.PORT , ()=>{
    console.log(`Server is working on port : ${process.env.PORT}`)
})