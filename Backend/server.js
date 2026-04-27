require("dotenv").config()  // .env ko access kr paenge puure server ke andar
const app = require("./src/app")
const connectToDB = require("./src/config/database")


connectToDB()

app.listen(3000,() =>{
    console.log("Server is running on port 3000");
    
})