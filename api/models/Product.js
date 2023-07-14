import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  author: { type: String, required: true},
  categoryName: { type: String, required: true },
  imgPath : { type: String, required: true},
  publishDate: { type: String, required: true }
});

const Product = mongoose.model("Product", productSchema);

export { productSchema };
export default Product;
