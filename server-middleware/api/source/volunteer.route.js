import express from "express";
import { List, Get } from "./volunteer.repo";
import { List as ListNoco, Get as GetNoco } from "./volunteer.repo.noco";
import { MakeSuccess, MakeFail } from "../helper/response";

/*
 ** Controller
 */
const GetVolunteers = async (req, res, next) => {
  try {
    const volunteers = await ListNoco();
    return MakeSuccess(res, volunteers);
  } catch (error) {
    const { message } = error;
    return MakeFail(res, 400, 1, message);
  }
};

const FindVolunteer = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const volunteer = await GetNoco(Id);
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
router.get("/:Id", FindVolunteer);

export default router;
