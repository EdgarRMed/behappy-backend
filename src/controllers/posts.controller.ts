import { Request, Response } from "express";
import { Post } from "../models/post";
import { User } from "../models/user";
import mongoose from "mongoose";

export const createPost = async (req: Request, res: Response) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    const { userid, text } = body;
    console.log(userid, text);
    const date: Date = new Date();
    const user = await User.findOne({ _id: userid });
    const newPost = new Post({
      userid: userid,
      username: user.username,
      date: date,
      text: text,
      likes: 0,
    });
    console.log(newPost);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const comment = req.body.comment;
    await Post.findOneAndUpdate(
      { _id: postId }, 
      {$push: {
        comments: { 
          $each: [{
            date: new Date(),
            user: new mongoose.Types.ObjectId(userId),
            text: comment
          }]
         }
      }},
      {upsert: true}
      ).populate({path: 'comments.user'})
      .exec(function(err, post){
        if (err) {
          console.log(err);
        } else {
          console.log(post);
          return res.status(200).send(post);
        }
      });

  } catch (error) { }
}

export const getPosts = async (req: Request, res: Response) => {
  try {
    Post.find({}).populate('comments.user').exec(function(err, posts){
      if (err) {
        console.log(err);
      } else {
        return res.status(200).send(posts);
      }
    });
  } catch (error) { }
};
