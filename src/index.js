//require('dotenv').config({path: './env'})//runs completely but damages code consistency
import dotenv from 'dotenv'
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js"; //APPROACH 2
import { app } from './app.js';
dotenv.config({
    path:'./.env'
})


connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERRR:",error);
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("MongoDB connection Error: ",error)
})





/*APPPROACH 1
import express from "express";
const app = express()
;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRR:",error);
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ",error)
        throw err;
    }
})() //ifee - immediately invoked function expression*///