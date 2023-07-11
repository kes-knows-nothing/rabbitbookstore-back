import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 일반 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { email, username, password, phone, address } = userInfo;

    // 이메일 중복 확인
    const exist = await this.userModel.exists(email);
    if (exist) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    } else {
      // 비밀번호 해쉬화
      const newUserInfo = { username, email, password, phone, address };
      // db에 저장
      const createdNewUser = await this.User.create(newUserInfo);
      return createdNewUser;
    }
  }

  // 일반 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 이메일 db에 존재 여부 확인
    const user = await this.userModel.findOne({email});
    if (user === []) {
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
    const expiresIn = '1h';
    const token = jwt.sign({ email, id: user._id }, secretKey, {expiresIn});
    return { token };
  }

  async saveDeliveryInfo(userId, deliveryInfo) {
    const updatedUser = await this.userModel.update({
      userId,
      update: deliveryInfo,
    });

    return updatedUser;
  }

  async getUserData(userId) {
    const user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    return user;
  }
}

const userService = new UserService(User);

export { userService };
