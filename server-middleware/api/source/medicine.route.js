import express from "express";
// import { Create, Get, Between, Update, ListNotice } from "./medicine.repo.noco";
import { Create, Get, Between, Update, ListNotice } from "./medicine.repo.sb";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetNoticeList = async (req, res, next) => {
  try {
    const list = await ListNotice({ shift: "night" });
    return MakeSuccess(res, list);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindMedicine = async (req, res, next) => {
  const { date, shift } = req.query;
  try {
    const medicines = await Get({ date, shift });
    if (medicines.length >= 1) {
      return MakeSuccess(res, medicines[0]);
    }

    if (medicines.length == 0) {
      const record = await Create({ date, shift });
      return MakeSuccess(res, record);
    }
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindBetweenMedicine = async (req, res, next) => {
  const { dateStart, dateEnd } = req.body;

  try {
    const medicines = await Between({ dateStart, dateEnd });
    if (medicines.length >= 1) {
      return MakeSuccess(res, medicines);
    }

    if (medicines.length == 0) {
      return MakeFail(res, 400, 2, "empty");
    }
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const UpdateMedicine = async (req, res, next) => {
  const { recordId, date, shift, cats, note, member } = req.body;

  try {
    await Update({ recordId, date, shift, cats, note, member });
    return MakeSuccess(res, "ok");
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/", FindMedicine);
router.post("/between", FindBetweenMedicine);
router.post("/update", UpdateMedicine);

router.get("/list-notice", GetNoticeList);

export default router;
