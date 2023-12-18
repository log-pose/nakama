import express from "express";
import router from "conf/routes";
import { loggerMiddleware } from "middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use("/auth", router);

export default app;
