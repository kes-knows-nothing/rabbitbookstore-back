import express from "express";
import { userService } from "../services/user-service";
import { loginRequired } from "../middleware";
import User from "../models/User";

const authRouter = express.Router();

authRouter.post("/join", async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (Object.keys(req.body).length === 0) {
      // is lodash is 대신 key 값이 존재하는지로 판별하거나 lodash
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const { email, username, password, phone, address } = req.body;
    const exist = await User.exists(email);
    if (exist) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    } else {
      const hashedPassword = await bcrypt.hash(password);
      const newUserInfo = {
        username,
        email,
        password: hashedPassword,
        phone,
        address,
      };
      const createdNewUser = await User.create(newUserInfo);
      res.status(201).json(createdNewUser);
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터가 db에 있는지 확인하고,
    // db 있을 시 로그인 성공 및, 토큰 및 관리자 여부 받아오기
    const loginResult = await userService.getUserToken({ email, password });

    res.status(200).json(loginResult);
  } catch (error) {
    next(error);
  }
});

authRouter.delete("/withdraw", loginRequired, async function (req, res, next) {
  try {
    const email = req.currentUserEmail;
    await userService.deleteUserData(email);
    if (deletedCount === 0) {
      throw new Error(`${email} 사용자 데이터의 삭제에 실패하였습니다.`);
    }
    return { result: "success" };
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/checkpassword",
  loginRequired,
  async function (req, res, next) {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
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
      // 비밀번호가 알맞는지 여부를 체크함
    } catch (error) {
      next(error);
    }
  }
);
export default authRouter;
