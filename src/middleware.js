import jwt from "jsonwebtoken";

function loginRequired(req, res, next) {
  const userToken = req.headers["authorization"]?.split(" ")[1];

  if (!userToken || userToken === "null") {
    console.log("서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음");

    res.status(401).json({
      result: "forbidden-approach",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });

    return;
  }

  try {
    const secretKey = process.env.ACCESS_SECRET;
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const userEmail = jwtDecoded.email;
    const userId = jwtDecoded.id;
    req.currentUserId = userId;
    req.currentUserEmail = userEmail;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      result: "forbidden-approach",
      reason: "정상적인 토큰이 아닙니다.",
    });

    return;
  }
}

export { loginRequired };
