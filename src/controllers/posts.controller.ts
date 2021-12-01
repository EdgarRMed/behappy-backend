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
  const userId = req.query.userId;

  try {
    await Post.find(
      {
        $and: [
          { _id: postId },
          {
            likes: {
              $elemMatch: {
                userId: userId,
              },
            },
          },
        ],
      },
      (err, post) => {
        if (err) {
          console.log(err);
        } else {
          if (Object.keys(post).length === 0) {
            // like the post
            Post.findOneAndUpdate(
              { _id: postId },
              {
                $addToSet: {
                  likes: {
                    $each: [
                      {
                        userId: userId,
                      },
                    ],
                  },
                },
              },
              { upsert: true, new: true }
            ).exec(function (err, postUpdated) {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).send("Liked");
              }
            });
          } else {
            // Dislike
            Post.findOneAndUpdate(
              { _id: postId },
              {
                $pull: { likes: { userId: userId } },
              },
              { safe: true, upsert: true },
              function (err, postUpdated) {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.status(200).send("Disliked");
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {}
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    Post.find({})
      .populate("comments.user")
      .populate("likes.userId")
      .exec(function (err, posts) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send(posts);
        }
      });
  } catch (error) {}
};
