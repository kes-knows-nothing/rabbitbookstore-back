import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const postJoin = async (req, res) => {
    const { 
        email, 
        username,
        password,  
        phone,
        address
    } = req.body;

    const exists = await User.exists({ $or: [{username}, {email}]})
    if (exists) {
        throw new Error(
            "해당 이메일은 이미 존재합니다."
          );
    
    }
   try {
    await User.create({
        email,
        username,
        password,
        phone,
        address
    })
   } catch(error) {
    return res.status(400).json("계정 생성 중에 에러가 발생하였습니다.");
   }
   return res.status(200);
}

export const postLogin = async (req, res) => {
    console.log("ok")
    const { 
        email,
        password,  
    } = req.body;
    const exists = await User.exists({ email })
    if (!exists) {
        return res.status(404).json("해당 유저를 찾을 수 없습니다.");
    } 
    const user = await User.findOne({ email })
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error(
            "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
          );
    }
    try {
        
        const token = jwt.sign({
              email: user.email,
            },process.env.ACCESS_SECRET, { expiresIn: "1h", issuer: "Rabbit Bookstore" });
        
            const refreshToken = jwt.sign({
                email: user.email,
            }, process.env.REFRESH_SECRET, { expiresIn: "24h", issuer: "Rabbit Bookstore" })

            // token 전송
            res.cookie("accessToken", accessToken, {
                secure : false,
                httpOnly : true,
            })

            res.cookie("refreshToken", accessToken, {
                secure : false,
                httpOnly : true,
            })

            res.status(200).json("로그인에 성공하였습니다.")    
          
    } catch (error) {
        res.status(500).json(error)
    }    
}

export const withdraw = (req, res) => {
    
}

export const logout = (req, res) => {
    return res.send("logout")
}

export const profile = (req, res) => {
    return res.send("profile")
}

export const editProfile = (req, res) => {
    return res.send("getEdit")
}

export const postEdit = (req, res) => {
    return res.send("postEdit")
}

app.get("/accesstoken", (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const data = jwt.verify(token, process.env.ACCESS_SECRECT);
        
        // 이 함수가 어디 쓰여야하는거지?>ㄴ
    } catch (error) {
        
    }
})