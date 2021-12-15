import express from "express";
import { Create, Get, Update, ListNotice } from "./medicine.repo";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetNoticeList = async (req, res, next) => {
  try {
    const list = await ListNotice();
    return MakeSuccess(res, list);
  } catch (error) {
    const { message } = error;
    MakeFail(res, 400, 1, message);
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
    MakeFail(res, 400, 1, message);
  }
};

const UpdateMedicine = async (req, res, next) => {
  const { recordId, date, shift, cats, note, member } = req.body;

  try {
    await Update({ recordId, date, shift, cats, note, member });
    return MakeSuccess(res, "");
  } catch (error) {
    const { message } = error;
    MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/", FindMedicine);
router.post("/update", UpdateMedicine);
router.get("/notice/list", GetNoticeList);

export default router;
