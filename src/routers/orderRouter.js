import express from "express";
import { loginRequired } from "../middleware";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

const orderRouter = express.Router();

orderRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const userId = req.currentUserId;
    const { products, address, phone, totalPrice } = req.body;
    const newOrder = await Order.create({
      ordererId: userId,
      products,
      phone,
      address,
      totalPrice
    });

    for (const product of products) {
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -product.quantity } }
      );
    }

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 본인이 주문한 목록 불러오기
orderRouter.get("/", loginRequired, async (req, res, next) => {
  try {
    const id = req.currentUserId;
    const userOrder = await Order.find({ ordererId: id });
    const user = await User.find({ ordererId: id });
    return res.status(200).json(userOrder, user);
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/:orderId", loginRequired, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const id = req.currentUserId;
    const order = await Order.findOne({ _id: orderId, ordererId: id });
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

orderRouter.delete("/:orderId", loginRequired, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const id = req.currentUserId;
    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      ordererId: id,
    });
    if (!deletedOrder) {
      res.status(404).json({ message: "삭제할 데이터가 존재하지 않습니다." });
      return;
    }
    res.status(200).json({ orderId });
  } catch (error) {
    next(error);
  }
});

export default orderRouter;
