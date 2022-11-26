import express from "express";
import dotenv from "dotenv";
import { ErrorHandler } from "./middleware/errorHandler.js";
import paymentRoute from './routes/payment.js'
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { validateRequest } from "./middleware/validateRequest.js";
const app=express();
dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use("/api/v1/payment",validateRequest,paymentRoute)

app.use(ErrorHandler);

app.listen(8800,()=>{
    console.log("Connected to Server")
})