import express from "express";
import { fakeUserData, loginRequired } from "../middleware";
import Product from "../models/Product";


const productRouter = express.Router();

// type Categories = 'novel' | 'poetry' | 'cook';

// interface Product {
//   name: String,
//   price: Number,
//   category: Categories
  
// }


productRouter.get("/", loginRequired, fakeUserData, async function (req, res, next) {
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
//  url을 이걸 어케하지?

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
