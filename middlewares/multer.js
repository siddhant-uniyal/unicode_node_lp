const multer = require("multer")


const storage = multer.memoryStorage();

const singleUpload = multer({ 
storage: storage,
limits : {fileSize : 10*1024*1024} 
}).single("file");




module.exports = {singleUpload };