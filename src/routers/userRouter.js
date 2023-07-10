import express from "express";
import { loginRequired } from "../middleware";
import User from "../models/User";

const userRouter = express.Router();

userRouter.get("/my-profile", loginRequired, async function (req, res, next) {
  try {
    const email = req.currentUserEmail;
    const userInfo = await User.findOne({ email });
    const info = {
      id: userInfo._id,
      email: userInfo.email,
      username: userInfo.username,
      phone: userInfo.phone,
      address: userInfo.address,
    }
    return res.status(200).json(info);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/", loginRequired, async function (req, res, next) {
  try {
    const { email, name, address, phone } = req.body;
    const userEmail = req.currentUserEmail;
    const update = {
      email,
      name,
      address,
      phone,
    };
    const userInfo = await User.findOneAndUpdate({ userEmail, update });
    return res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
