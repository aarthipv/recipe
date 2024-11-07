import express from "express";
import cors from 'cors' 
import mongoose from 'mongoose'

import {userRouter} from './routes/users.js'

const app=express()
app.use(express.json());

app.use(cors());
app.use("/auth",userRouter);

mongoose.connect("mongodb+srv://aarthipv2004:MERNpassword123@recipes.d5pov.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes")
app.listen(3002,() => console.log("Server started!"))