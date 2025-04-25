import express from "express";
import { List, Get } from "./volunteer.repo";
// import { List as ListNoco, Get as GetNoco } from "./volunteer.repo.noco";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetVolunteers = async (req, res, next) => {
  try {
    const volunteers = await List();
    return MakeSuccess(res, volunteers);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindVolunteer = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const volunteer = await Get(recordId);
    return MakeSuccess(res, volunteer);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

/*
 ** Router
 */
const router = express.Router();

router.get("/list", GetVolunteers);
router.get("/:recordId", FindVolunteer);

export default router;
