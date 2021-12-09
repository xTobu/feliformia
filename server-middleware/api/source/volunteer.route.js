import express from "express";
import { List, Get } from "./volunteer.repo";

// Controller
const GetVolunteers = async (req, res, next) => {
  try {
    const volunteers = await List();
    res.status(200).json({
      status: "success",
      code: 0,
      msg: "",
      data: volunteers,
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

const FindVolunteer = async (req, res, next) => {
  const { recordId } = req.params;
  try {
    const volunteer = await Get(recordId);
    res.status(200).json({
      status: "success",
      code: 0,
      msg: "",
      data: volunteer,
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

router.get("/list", GetVolunteers);
router.get("/:recordId", FindVolunteer);

export default router;
