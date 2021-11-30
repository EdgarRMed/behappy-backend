import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { User } from "../models/user";
import { Password } from "../services/password";

export const signUp = async (req: Request, res: Response) => {
  try {
    // Getting the Request Body
    const { username, email, password } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password,
    });

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign(
      {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
      "beehappy",
      {}
    );

    const cookies = new Cookies(req, res);
    cookies.set("token", token);

    return res.status(201).json({ message: "Registered" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound)
      return res.status(400).json({ message: "wrong username or password" });

    const matchPassword = await Password.compare(
      userFound.password,
      req.body.password
    );

    if (!matchPassword) {
      return res.status(401).json({
        token: null,
        message: "wrong username or password",
      });
    }

    // Create a token
    const token = jwt.sign(
      {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
      },
      "beehappy",
      {}
    );

    const cookies = new Cookies(req, res);
    cookies.set("token", token);

    return res.status(200).json({ message: "Logged in" });
  } catch (error) {
    console.log(error);
  }
};

export const signOut = (req: Request, res: Response) => {
  const cookies = new Cookies(req, res);
  cookies.set("token");
  return res.status(200).json({ message: "goodbye" });
};

export const currentUser = (req: Request, res: Response) => {
  const cookies = new Cookies(req, res);
  const token: string = cookies.get("token")!;
  if (!token) {
    res.status(404).json({ message: "no token provided" });
  }
  try {
    jwt.verify(token, "beehappy", (err, currentUser) => {
      if (err) {
        res.send(err.message);
      } else {
        res.status(200).json({ currentUser });
      }
    });
  } catch (err) {}
};
