import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    username: {type: mongoose.Schema.Types.username, ref:"User"}
});

const Order = mongoose.model("Order", orderSchema);
export default Order;