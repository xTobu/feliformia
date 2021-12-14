import express from "express";
import cat from "./source/cat.route";
import volunteer from "./source/volunteer.route";
import regular from "./source/regular.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/cat", cat);
app.use("/volunteer", volunteer);
app.use("/regular", regular);

export default app;
