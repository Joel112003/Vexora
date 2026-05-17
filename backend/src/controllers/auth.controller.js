import { User, Session } from "../models/index.js";
import { apiResponse } from "../utilis/apiResponse.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utilis/jwt.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json(apiResponse(false, "Email or Username is already taken"));
    }

    const user = await User.create({
        username,
        email,
        passwordHash = password,
        ipAddress = req.ip,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken =  generateRefreshToken(user._id);

    await Session.create({
        userId = user._id,
        refreshToken,
        ipAddress= req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken' , refreshToken, COOKIE_OPTIONS);

    res.status(201).json(apiResponse(true , 'Account created successfully' , {
        accessToken,
        user:{
            id : user._id,
            username: user.username,
            email:user.email,
            balance:user.balance,
            role:user.role,
        }
    }));
  } catch (error) {
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const login = async(req,res) =>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email}).select('+passwordHash');

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json(apiResponse(false , 'Invalid email or password'));
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // de-activate all the session for this user and create a new one
        await Session.updateMany({ userId: user._id } , { isActive: false });

        await Session.create({
            userId = user._id,
            refreshToken,
             ipAddress= req.ip,
            userAgent: req.headers['user-agent'],
             expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        res.cookie('refreshToken' , refreshToken , COOKIE_OPTIONS);
        res.json(apiResponse(true, 'Logged in successfully', {
                 accessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    balance: user.balance,
                    role: user.role,
      },
    }));

    }catch(error){
        return res.status(410).json(apiResponse(false , error.message))
    }
}

export const refreshToken = async(req,res) => {
    try{
        const token = req.cookie.refreshToken;
        if(!token){
            return res.status(401).json(apiResponse(false , 'No refresh Token is available'));
        }

        const decoded = verifyRefreshToken(token);
        const session = await Session.create({
            userId : decoded.id,
            isActive :true,
        }).select('+refreshToken');

        if(!session){
            return res.status(401).json(apiResponse(false , 'Session expired , Please log in again'));
        }
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json(apiResponse(false , 'User not found!'))
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // now old refresh token is been replaced
        session.refreshToken = newRefreshToken;
        session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session.save();

        res.cookie('refreshToken' , newRefreshToken ,COOKIE_OPTIONS );

        res.json(apiResponse(true , 'Token refreshed' , {accessToken : newAccessToken}))


    }catch(error){
        return res.status(401).json(apiResponse(false , 'Invalid or expired refresh token'))
    }
}

