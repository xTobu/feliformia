import express from "express";
import { List, Get } from "./notice.repo";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetNotices = async (req, res, next) => {
  try {
    const notices = await List();
    return MakeSuccess(res, notices);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindNotice = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const notice = await Get(recordId);
    return MakeSuccess(res, notice);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/list", GetNotices);
router.get("/:recordId", FindNotice);

export default router;
