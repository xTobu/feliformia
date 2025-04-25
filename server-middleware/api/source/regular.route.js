import express from "express";
// import { Create, Get, Between, Update } from "./regular.repo.noco";
import { Create, Get, Between, Update } from "./regular.repo";
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
    return MakeSuccess(res, "ok");
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindBetweenRegular = async (req, res, next) => {
  const { dateStart, dateEnd } = req.body;

  try {
    const regulars = await Between({ dateStart, dateEnd });
    if (regulars.length >= 1) {
      return MakeSuccess(res, regulars);
    }

    if (regulars.length == 0) {
      return MakeFail(res, 400, 2, "empty");
    }
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
router.post("/between", FindBetweenRegular);
router.post("/update", UpdateRegular);

export default router;
