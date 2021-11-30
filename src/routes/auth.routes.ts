import { Router } from "express";
const router = Router();

import * as authCtrl from "../controllers/auth.controller";
import { checkDuplicateUsernameOrEmail } from "../middlewares/verifySignUp";

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Only admin user can add more users
router.post("/signup", checkDuplicateUsernameOrEmail, authCtrl.signUp);

router.post("/signin", authCtrl.signIn);
router.post("/signout", authCtrl.signOut);
router.get("/currentuser", authCtrl.currentUser);

export default router;
