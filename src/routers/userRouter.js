import express from "express";
import { loginRequired } from "../middleware";
import User from "../models/User";
import bcrypt from "bcrypt"

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
    const {
      email,
      username,
      password,
      newPassword,
      address,
      phone,
    } = req.body;
    const userId = req.currentUserId;
    if (originPassword === "") {
      const update = {
        email,
        username,
        address,
        phone,
      };
      const userInfo = await User.findByIdAndUpdate(userId, update);
      return res.status(200).json(userInfo);
    } else {
      const originPassword = await bcrypt.hash(password, 10);
      const changedPassword = await bcrypt.hash(newPassword, 10);
      if (originPassword === changedPassword) {
        throw new Error(
          "이전 비밀번호와 같습니다. 다른 비밀번호를 설정해주세요."
        );
      }
      // if ( newPassword !== newChkPassword) {
      //   throw new Error(
      //     "변경하려는 비밀번호와 확인용 비밀번호가 일치하지 않습니다."
      //   );
      // }
      const update = {
        email,
        username,
        password: changedPassword,
        address,
        phone,
      };
      const userInfo = await User.findByIdAndUpdate(userId, update);
      return res.status(200).json(userInfo);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
