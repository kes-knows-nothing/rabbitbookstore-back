import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stcok: { type: Number, required: true },
    categoryName: { type: String,  required: true, unique: true }
});

const Product = mongoose.model("Product", productSchema);
export default Product;