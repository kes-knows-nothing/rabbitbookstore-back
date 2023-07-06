import './db'
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import jwt from 'jsonwebtoken';

import userRouter from "./routers/userRouter";
import productRouter from "./routers/productRouter"
import orderRouter from './routers/orderRouter';
import morgan from "morgan";


const app = express();
const logger = morgan("dev")
dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173/',
    methods : [`GET`, 'POST'],
    credentials: true
}))

app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())



// api 라우터
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);





app.listen(4000, function() {
    console.log("Server is running now successfully!")
})