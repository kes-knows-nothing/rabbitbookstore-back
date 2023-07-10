import express from "express";
import { loginRequired } from "../middleware";
import Product from "../models/Product";

const productRouter = express.Router();

productRouter.get("/", loginRequired, async function (req, res, next) {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      res.status(200).json([]);
    }
    const products = await Product.find({
      productName: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get(
  "/:productId",
  loginRequired,
  async function (req, res, next) {
    try {
      const productId = req.params;
      const exist = await Product.exists({ _id: productId });
      if (!exist) {
        throw new Error("상품이 존재하지 않습니다.");
      }
      const productObj = await Product.findById({ _id: productId });
      res.status(200).json(productObj);
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
