import express from "express";
import { List, Get } from "./cat.repo";
import { List as ListNoco, Get as GetNoco } from "./cat.repo.noco";

import { MakeSuccess, MakeFail } from "../helper/response";

// Controller
const GetCats = async (req, res, next) => {
  try {
    const cats = await ListNoco();
    return MakeSuccess(res, cats);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindCat = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const cat = await GetNoco(Id);
    return MakeSuccess(res, cat);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

// Router
const router = express.Router();

router.get("/list", GetCats);
router.get("/:Id", FindCat);

export default router;
