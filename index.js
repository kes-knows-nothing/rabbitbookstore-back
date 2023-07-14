import "./db";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import morgan from "morgan";

import userRouter from "./src/routers/userRouter";
import productRouter from "./src/routers/productRouter";
import orderRouter from "./src/routers/orderRouter";
import authRouter from "./src/routers/authRouter";

const app = express();
const logger = morgan("dev");
dotenv.config();

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname)});
});

// api 라우터
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/static", express.static("public"));


app.use((req, res, next) => {
    const error = new Error("리소스를 찾을 수 없습니다");
    error.statusCode = 404;
    next(error);
});

// 에러 핸들러 등록
app.use((error, req, res, next) => {
    console.log(error);
    res.statusCode = error.statusCode ?? 500;
    res.json({
        data: null,
        error: error.message,
    });
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server is running now successfully!! port: ${PORT}`);
});

module.exports = app;