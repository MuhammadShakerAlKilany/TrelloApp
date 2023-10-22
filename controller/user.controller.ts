import { RequestHandler } from "express";
import {
  UserSignUp,
  UserRes,
  UserLogin,
  User,
  UserUpdate,
} from "../interfaces/user.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import UserDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";
import { ResInterface } from "../interfaces/app.interface";
import { ObjectId } from "mongoose";

const userDao = new UserDao();

export const signUp = tryCatchErr<UserSignUp, ResInterface<UserRes>>(
  async (req, res) => {
    const user = req.body;
    const newUser = await userDao.addUser(user);
    // console.log({...newUser})
    const data = Object.create(newUser);
    data.password = undefined;
    const token = jwt.sign(data.toJSON(), process.env.SECRET_KEY!);
    await sendVerified(newUser.email, token);

    res
      .status(201)
      .json({
        message: `signUp succass check your email ${data.email} for verified`,
        data,
      });
  }
);
export const login = tryCatchErr<UserLogin, ResInterface<UserRes>>(
  async (req, res) => {
    const userFind = await userDao.findUserByEmail(req.body.email);

    if (!userFind)
      return res
        .status(404)
        .json({ message: `Not found user with email ${req.body.email}` });
    if (userFind) {
      if (userFind?.softDelete)
        return res.json({ message: `user is soft Delete` });
      if (!userFind?.isVerified)
        return res.json({ message: `email ${userFind?.email} not Verified` });
      const compared = await bcrypt.compare(
        req.body.password,
        userFind.password
      );
      if (compared) {
        const data = userFind as UserRes;
        data.password = undefined;

        const token = jwt.sign(data.toJSON(), process.env.SECRET_KEY!);
        return res.cookie("token", token).json({ message: "user login", data, token: token });
      } else {
        return res.json({ message: "password is rong" });
      }
    }
    console.log(" after log in");
  }
);

export const Verifi = tryCatchErr<
  never,
  ResInterface<UserRes>,
  { token: string }
>(async (req, res) => {
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY!) as User;
  const userVerifie = await userDao.verifie(user._id, true);
  const data = userVerifie as UserRes;
  data.password = undefined;
  const tokenData = jwt.sign(
    data.toJSON(),
    process.env.SECRET_KEY!
  ) as unknown as UserRes;

  res.cookie("token", tokenData).json({ message: "email is verify", data });
});
export const softDelete = tryCatchErr<never, ResInterface<UserRes>, never>(
  async (req, res) => {
    const token = req.cookies?.token;
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as UserRes;
    let isDelete: boolean;

    isDelete = req.method == "DELETE";

    const user = await userDao.softDeleteUser(tokenData._id, isDelete);
    const data = user as UserRes;
    data.password = undefined;
    res.clearCookie("token").json({ message: "user is soft Delete", data });
  }
);
export const updateUser = tryCatchErr<
  UserUpdate,
  ResInterface<UserRes>,
  { id: string }
>(async (req, res) => {
  const user = req.body;
  let id: ObjectId;
  if (!(user.age || user.password || user.userName))
    return res
      .status(404)
      .json({ message: "no age||password||userName to update " });
  if (req.params?.id) {
    id = req.params?.id as unknown as ObjectId;
  } else {
    const token = req.cookies?.token;

    if (!token) return res.status(403).json({ message: "you are logOut" });
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as UserRes;
    id = tokenData._id;
  }

  // console.log(id)
  const userUpdate = (await userDao.updateUser(id, user)) as UserRes;
  //   console.log(userUpdate)
  if (!userUpdate) return res.status(403).json({ message: "you are logOut " });
  userUpdate.password = undefined;
  const token = jwt.sign(userUpdate.toJSON(), process.env.SECRET_KEY!);
  return res
    .cookie("token", token)
    .json({ message: "Updated", data: userUpdate });
});
export const deleteUser = tryCatchErr<
  UserUpdate,
  ResInterface<UserRes>,
  { id: string }
>(async (req, res) => {
  let id: ObjectId;
  if (req.params?.id) {
    id = req.params?.id as unknown as ObjectId;
  } else {
    const token = req.cookies?.token;
    if (!token) return res.status(403).json({ message: "you are logOut" });
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as UserRes;
    id = tokenData._id;
  }

  const userDeleted = (await userDao.deleteUserById(id)) as UserRes;
  if (userDeleted) return res.status(404).json({ message: "not found user" });
  res.json({ message: "Deleted", data: userDeleted });
});

export const logout = tryCatchErr<never, ResInterface<never>>(
  async (req, res) => {
    res.clearCookie("token").json({ message: "you are logOut" });
  }
);
async function sendVerified(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL!,
      pass: process.env.PASS_EMAIL!,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL!,
    to: email,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
    html: `<a href='${process.env.URL}/api/v1/users/verifie/${token}'>Verifie Email</a>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent: " + info.response);
}

import { OAuth2Client } from 'google-auth-library';

export const googleLogin = tryCatchErr<{ credential: string },{message:string,data:UserRes ,token:string }>(async (req, res) => {
  const tokenGoogle = req.body.credential
  const user = await verifyGoogleToken(tokenGoogle)
  if (user) {
    const userFind = await userDao.findUserByEmail(user?.email!) as UserRes
    if (userFind) {
      userFind.password =undefined
      const token = jwt.sign(userFind.toJSON(), process.env.SECRET_KEY!);
      return res.cookie("token", token).json({ message: "user login", data:userFind,token: token });
    }else{
      const tokenGoogle = req.body.credential
      const user = await verifyGoogleToken(tokenGoogle) as unknown as UserSignUp
      const newUser = await userDao.addUser(user);
      const data = Object.create(newUser);
      data.password = undefined;
      const token = jwt.sign(data.toJSON(), process.env.SECRET_KEY!);
  res.status(201)
        .json({
          message: ``,
          data,token
        }); 
    }

  }
})

async function verifyGoogleToken(token: string) {
  const clientId = '880761381934-16eu08t3on4omt7mhtpspnds25quusdj.apps.googleusercontent.com';

  const client = new OAuth2Client(clientId);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload() as unknown as { name: string, email: string, jti: string, }
    const user: Pick<User, "email" | "password" | "userName" | "age" | "gender" | "isVerified"> = {
      userName: payload.name,
      email: payload.email,
      password: payload.jti,
      age: 0,
      gender: "male",
      isVerified: true,
    }
    return user;
  } catch (error) {
    console.error('Error verifying Google token:', error);
  }
}