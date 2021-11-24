import express, { Request, Response } from "express";
import { Post } from "../models/post";


export const createPost = async (req: Request, res: Response) => {
    try {
        const body = JSON.parse(JSON.stringify(req.body));
        const { userid, text} = body;
        console.log(userid, text);
        const date: Date = new Date();
        const newPost = new Post(
            {
                user: userid,
                date: date,
                text: text,
                likes: 0
            }
        );
        console.log(newPost);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
    }
}