import express from "express";
import { loginRequired } from "../middleware";
import User from "../models/User";
import bcrypt from "bcrypt";

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
    };
    return res.status(200).json(info);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/", loginRequired, async function (req, res, next) {
  try {
    const { email, username, password, newPassword, address, phone } = req.body;
    const userId = req.currentUserId;
    if (password === "" || !password) {
      const update = {
        email,
        username,
        address,
        phone,
      };
      const userInfo = await User.findByIdAndUpdate(userId, update);
      return res.status(200).json(userInfo);
    } else {
      const storedUser = await User.findById(userId)
      const storedPassword = storedUser.password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        storedPassword
      );
      console.log(isPasswordCorrect)
      if (!isPasswordCorrect) {
        throw new Error(
          "현재 비밀번호를 잘못 입력하였습니다."
        );
      }
      console.log(newPassword)
      const changedPassword = await bcrypt.hash(newPassword, 10);
      console.log(changedPassword)
      const update = {
        email,
        username,
        password: changedPassword,
        address,
        phone,
      };
      console.log(update)
      const userInfo = await User.findByIdAndUpdate(userId, update);
      return res.status(200).json(userInfo);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
