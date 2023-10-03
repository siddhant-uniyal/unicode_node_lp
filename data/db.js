
const mongoose = require("mongoose")

const connectToDB = () => {
    mongoose.
connect(process.env.MONGO_URI,{
    dbName:"node_lp_1",
})
.then((c)=>console.log(`Database connected with ${c.connection.host}`))
.catch((e)=>console.log(e))
} 

module.exports.connectToDB = connectToDB;