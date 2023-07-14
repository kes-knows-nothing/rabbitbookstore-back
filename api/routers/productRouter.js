import express from "express";
import Product from "../models/Product";

const productRouter = express.Router();

productRouter.get("/", async function (req, res, next) {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      res.status(200).json([]);
    }
    const products = await Product.find({
      categoryName: keyword
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get(
  "/:productId",
  async function (req, res, next) {
    try {
      const {productId} = req.params;
      if (!productId) {
        throw new Error("찾으려는 상품 아이디가 없습니다.");
      }
      console.log(productId)
      const productObj = await Product.findById( productId );
      console.log(productObj)
      if (!productObj) {
        throw new Error("상품이 존재하지 않습니다.");
      }
      res.status(200).json(productObj);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
);

export default productRouter;
