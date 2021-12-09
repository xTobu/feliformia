import express from "express";
import { List, Get } from "./cat.repo";

// Controller
const GetCats = async (req, res, next) => {
  // const { body } = req;
  try {
    const cats = await List();
    res.status(200).json({
      status: "success",
      code: 0,
      msg: "",
      data: cats,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      code: 1,
      msg: error.message,
      data: null,
    });
  }
};

const FindCat = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const cat = await Get(recordId);
    res.status(200).json({
      status: "success",
      code: 0,
      msg: "",
      data: cat,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      code: 1,
      msg: error.message,
      data: null,
    });
  }
};

// Router
const router = express.Router();

router.get("/list", GetCats);
router.get("/:recordId", FindCat);

export default router;
