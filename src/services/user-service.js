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
  
    // 있으면 email로 객체를 찾고 
    // 비밀번호 일치 여부 확인
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

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.ACCESS_SECRET;
    const expiresIn = '1h';
    const token = jwt.sign({ email, id: user._id }, secretKey, {expiresIn});

    return { token };
  }

  // 비밀번호 맞는지 여부만 확인
  // async checkUserPassword(password) {
  //   // 이메일 db에 존재 여부 확인
  //   const user = await this.userModel.findById(userId);

  //   // 비밀번호 일치 여부 확인
  //   const correctPasswordHash = user.password;
  //   const isPasswordCorrect = await bcrypt.compare(
  //     password,
  //     correctPasswordHash
  //   );

  //   if (!isPasswordCorrect) {
  //     throw new Error(
  //       "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
  //     );
  //   }
  //   // 비밀번호 일치함. 유저 정보 반환
  //   return user;
  // }

  
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
  // 유저 삭제
  async deleteUserData(email) {
    const { deletedCount } = await this.userModel.deleteOne(email);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new Error(`${email} 사용자 데이터의 삭제에 실패하였습니다.`);
    }

    return { result: "success" };
  }
}

const userService = new UserService(User);

export { userService };
