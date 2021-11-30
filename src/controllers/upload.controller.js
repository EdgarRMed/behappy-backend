"use strict";
import { Post } from "../models/post";
const path = require("path");

export const uploadFile = async (req, res) => {
  try {
    const id = String(req.params.id);
    const { filename } = req.file;
    await Post.findOneAndUpdate(
      { _id: id },
      { image: filename },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
        console.log(doc);
        return res.status(200).send(doc);
      }
    );
  } catch (error) {}
};

export const getImage = (req, res) => {
  const { filename } = req.query;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, "images/" + filename);
  return res.sendFile(fullfilepath);
};
