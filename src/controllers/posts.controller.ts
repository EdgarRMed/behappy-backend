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

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.query.postId;
  try {
    Post.deleteOne({ _id: postId }, (err: any, deletedPost: any) => {
      if (err) {
        console.error(err);
        res.status(500);
      } else {
        res.status(200).send(deletedPost);
      }
    });
  } catch (error) {}
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId;
    const userId = String(req.query.userId);
    const comment = req.body.comment;
    Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            $each: [
              {
                date: new Date(),
                user: new mongoose.Types.ObjectId(userId),
                text: comment,
              },
            ],
          },
        },
      },
      { upsert: true, new: true }
    )
      .populate({ path: "comments.user" })
      .exec(function (err, post) {
        if (err) {
          console.log(err);
        } else {
          console.log(post);
          return res.status(200).send(post);
        }
      });
  } catch (error) {}
};

export const likePost = async (req: Request, res: Response) => {
  const postId = req.query.postId;
  const like = req.query.like;
  try {
    if (JSON.parse(String(like))) {
      Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { upsert: true, new: true },
        (err, postUpdated) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            res.status(200).send(postUpdated);
          }
        }
      );
    } else {
      Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { upsert: true, new: true },
        (err, postUpdated) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            res.status(200).send(postUpdated);
          }
        }
      );
    }
  } catch (error) {}
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    Post.find({})
      .sort({ date: -1 })
      .populate("comments.user")
      .exec(function (err, posts) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send(posts);
        }
      });
  } catch (error) {}
};
