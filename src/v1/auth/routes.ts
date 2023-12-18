import { Router } from "express";
import { register, login, getUser } from "./controller";
import { verifyToken } from "middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user", verifyToken, getUser);

export default router;
