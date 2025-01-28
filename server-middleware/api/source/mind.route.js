import express from "express";
import { List, Get } from "./mind.repo.noco";
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
  const { Id } = req.params;
  try {
    const mind = await Get(Id);
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
router.get("/:Id", FindMind);

export default router;
