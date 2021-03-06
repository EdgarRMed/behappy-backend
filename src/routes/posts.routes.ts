import { Router } from "express";
const router = Router();
import multer from "multer";

import * as postCtrl from "../controllers/posts.controller";
import * as uploadCtrl from "../controllers/upload.controller";

var storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/createpost", postCtrl.createPost);
router.delete("/deletepost", postCtrl.deletePost);
router.get("/getposts", postCtrl.getPosts);
router.post("/likepost", postCtrl.likePost);

router.post("/createcomment", postCtrl.createComment);

router.post("/uploadimage/:id", upload.single("image"), uploadCtrl.uploadFile);
router.get("/image", uploadCtrl.getImage);
export default router;
