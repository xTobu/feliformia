import express from "express";
import { List, Get } from "./cat.repo.sb";

import { MakeSuccess, MakeFail } from "../helper/response";

// Controller
const GetCats = async (req, res, next) => {
  try {
    const cats = await List();
    return MakeSuccess(res, cats);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindCat = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const cat = await Get(recordId);
    return MakeSuccess(res, cat);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

// Router
const router = express.Router();

router.get("/list", GetCats);
router.get("/:recordId", FindCat);

export default router;
