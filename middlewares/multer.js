const multer = require("multer")


const storage = multer.memoryStorage();

const singleUpload = multer({ 
storage: storage,
limits : {fileSize : 10*1024*1024} 
}).single("file");

const multiUpload = multer({ 
  storage: storage,
  limits : {fileSize : 10*1024*1024} 
  }).array("files" ,  4);



module.exports = {singleUpload , multiUpload};