import express from "express";
import { userService } from "../services";

const userRouter = express.Router();


userRouter.post("/join", async (req, res, next) => {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
  
      // req (request) 에서 데이터 가져오기
      const { email, username, password, phone, address } = req.body
  
      // 위 데이터를 유저 db에 추가하기
      const newUser = await userService.addUser({
        username,
        email,
        password,
        phone,
        address
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  });
  

userRouter.post("/login", async function (req, res, next) {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
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


  


userRouter.delete("/withdraw", withdraw);
userRouter.get("/my-profile", profile);
userRouter.put("my-profile", editProfile);

export default userRouter;