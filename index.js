import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import router from "./routes/index.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(chalk.green(`mode: ${process.env.MODE || "not defined -> DEV"}`));
    console.log(`server is up and running onport ${port}`);
})