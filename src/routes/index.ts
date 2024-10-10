import express from "express";
import user from "./user";
import chat from './chat-history'

const router = express.Router();

router.use("/api", user);
router.use("/api", chat);

export default router;
