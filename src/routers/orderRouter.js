import express from "express";
import { loginRequired } from "../middleware";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

const orderRouter = express.Router();

orderRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      // is lodash is 대신 key 값이 존재하는지로 판별하거나 lodash
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const userId = req.currentUserId;
    // 2. 유저랑 같은 부분을 어떻게 해결할 것인가?
    const { products, address, name, phone } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await Order.create({
      ordererId: userId,
      products,
      phone,
      address,
      name,
    });

    for (const product of products) {
      await Product.updateOne(
        { _id: product.id },
        { $inc: { stock: -product.count } }
      );
    }
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/", loginRequired, async (req, res, next) => {
  try {
    const email = req.currentUserEmail;
    const userInfo = await User.findOne({ email });
    const userId = userInfo._id;
    const userOrder = await Order.findById(userId);
    return res.status(200).json(userOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/:orderId", loginRequired, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById({ orderId });
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

orderRouter.delete("/:orderId", loginRequired, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await Order.findByIdAndDelete({ orderId });
  } catch (error) {
    next(error);
  }
});

export default orderRouter;
