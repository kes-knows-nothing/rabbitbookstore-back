import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id : { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryName: { type: String, required: true },
  author: { type: String, required: true},
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  ordererId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: {
    type: [productSchema],
    default: [],
  },
  address: {
    type: String,
    required: true,
  },
  phone: { type: String, required: true },
  totalPrice: { type: String, required: true }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
