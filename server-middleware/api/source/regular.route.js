import express from "express";
import { List } from "./cat.controller";

const router = express.Router();

router.get("/list", List);

export default router;
