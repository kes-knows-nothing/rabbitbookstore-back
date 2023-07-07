import express from "express";
import { userService } from "../services/user-service"
import { loginRequired } from "../middleware";


const userRouter = express.Router();


userRouter.post("/join", async (req, res, next) => {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (Object.keys(req.body).length === 0
      ) {
        // is lodash is 대신 key 값이 존재하는지로 판별하거나 lodash
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

userRouter.delete("/withdraw", loginRequired, async function (req, res, next) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(userToken, secretKey);
    // 이렇게하는게 맞는가? 기본적으로 삭제를 위해 유저를 특정해야하는데
    // 유저 정보를 토큰을 통한 디코드를 통해서 확인함
    const email = jwtDecoded.email;
    await userService.deleteUserData(email)
    if (deletedCount === 0) {
      throw new Error(`${email} 사용자 데이터의 삭제에 실패하였습니다.`);
    }

    return { result: "success" }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/checkpassword", loginRequired, async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const email = jwtDecoded.email;
    // req (request) 에서 데이터 가져오기
    await 
    const userId = req.currentUserId;
    const password = req.body.password;

    // 비밀번호가 알맞는지 여부를 체크함
    const checkResult = await userService.checkUserPassword(userId, password);

    res.status(200).json(checkResult);
  } catch (error) {
    next(error);
  }


} )



// userRouter.get("/logout", profile);
// userRouter.put("my-profile", editProfile);

export default userRouter;