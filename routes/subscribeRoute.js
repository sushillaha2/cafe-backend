import express from "express";
import { handleSubscribe } from "../controllers/subscribeController.js";

const router = express.Router();

router.post("/", handleSubscribe); //  Uses controller function

export default router;
