import express from "express";
import { List, Get } from "./mind.repo.sb";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetMinds = async (req, res, next) => {
  try {
    const minds = await List();
    return MakeSuccess(res, minds);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindMind = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const mind = await Get(recordId);
    return MakeSuccess(res, mind);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/list", GetMinds);
router.get("/:recordId", FindMind);

export default router;
