import express from "express";
import { LoginUser, Register, getAllUser, getUserById, updateUser } from "../controllers/User.js";

const router = express.Router();

router.post("/user/register", Register);
router.get("/user/", getAllUser);
router.get("/user/:id", getUserById);
router.put("/user/update-user/:id", updateUser);

//login
router.post("/login", LoginUser);

export default router;
