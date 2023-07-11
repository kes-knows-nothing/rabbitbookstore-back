import express from "express";
import { loginRequired } from "../middleware";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

const orderRouter = express.Router();

orderRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const userId = req.currentUserId;
    const { products, address, name, phone } = req.body;
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
