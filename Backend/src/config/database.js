const mongoose = require("mongoose")

async function connectToDB(){   // connecting to DB
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectToDB    //exporting the function