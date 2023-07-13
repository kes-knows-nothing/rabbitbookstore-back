import express from "express";
import { loginRequired } from "../middleware";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/join", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const { email, username, password, phone, address } = req.body;
    const exist = await User.exists({email});
    if (exist) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const UserInfo = {
        username,
        email,
        password: hashedPassword,
        phone,
        address,
      };
      const createdNewUser = await User.create(UserInfo);
      res.status(201).json(createdNewUser)
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post("/duplicateChkId", async (req, res, next) => {
  try {
      if (Object.keys(req.body).length === 0) {
          throw new Error(
              "headers의 Content-Type을 application/json으로 설정해주세요"
          );
      }
      const { email } = req.body;
      const exist = await User.exists({ email });
      if (exist) {
          throw new Error(
              "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
          );
      } else {
          res.status(200).json({ result: "success" });
      }
  } catch (error) {
      next(error);
  }
});

authRouter.post("/login", async function (req, res, next) {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email});
    if (!user || user === []) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }
    const secretKey = process.env.ACCESS_SECRET;
    
    const token = jwt.sign({ email, id: user._id }, secretKey);
   
    res.json(token);

  } catch (error) {
    next(error);
  }
});

authRouter.delete("/withdraw", loginRequired, async function (req, res, next) {
  try {
    const email = req.currentUserEmail;
    const deletedCount = await User.deleteOne({email});
    if (deletedCount === 0) {
      throw new Error(`${email} 사용자 데이터의 삭제에 실패하였습니다.`);
    }
    res.json({ result: "사용자 데이터가 삭제 되었습니다." })
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/checkpassword",
  loginRequired,
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
      const email = req.currentUserEmail;
      const user = await User.findOne(email);
      const correctPasswordHash = user.password;
      const isPasswordCorrect = await bcrypt.compare(
        password,
        correctPasswordHash
      );

      if (!isPasswordCorrect) {
        throw new Error(
          "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
export default authRouter;
