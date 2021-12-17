import express from "express";
import { Push } from "./line.repo";
import { MakeSuccess, MakeFail } from "../helper/response";
// Controller
const PushMessage = async (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return MakeFail(res, 400, 2, "empty body.text");
  }

  try {
    await Push({ text });
    return MakeSuccess(res, "");
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

// Router
const router = express.Router();

router.post("/message/push", PushMessage);

export default router;
