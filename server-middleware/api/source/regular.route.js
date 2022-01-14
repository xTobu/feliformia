import express from "express";
import { Create, Get, Update } from "./regular.repo";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const FindRegular = async (req, res, next) => {
  const { date, shift } = req.query;
  try {
    const regulars = await Get({ date, shift });
    if (regulars.length >= 1) {
      return MakeSuccess(res, regulars[0]);
    }

    if (regulars.length == 0) {
      const record = await Create({ date, shift });
      return MakeSuccess(res, record);
    }
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const UpdateRegular = async (req, res, next) => {
  const { recordId, date, shift, cats, note, member } = req.body;

  try {
    await Update({ recordId, date, shift, cats, note, member });
    return MakeSuccess(res, "");
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/", FindRegular);
router.post("/update", UpdateRegular);

export default router;
