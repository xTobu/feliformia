import express from "express";
import bodyParser from "body-parser";
import { getCats } from "./airtable";

const app = express();
app.use(bodyParser.json());

app.get("/hello", async (req, res, next) => {
  try {
    const cats = await getCats();

    const { body } = req;
    res.status(200).json({
      body,
      cats,
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    });
  } catch (error) {
    // Passes errors into the error handler
     return next(error);
  }
});

export default app;
