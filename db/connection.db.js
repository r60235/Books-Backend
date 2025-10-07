const mongoose= require("mongoose");
require("dotenv").config();
const dbURI=process.env.MONGODB;

const connectDB = async () => {
   await mongoose.connect(dbURI)
      .then(()=>{
          console.log("Connected to DB");
      })
      .catch((e)=>{
          console.log("An error occurred while connecting to db");
      })
};

module.exports = connectDB;
