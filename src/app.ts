import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { routerAuth } from "./routes/routerAuth";
dotenv.config();

export const app = () => {
  const express = Express();

  express.use(cors());

  express.use(Express.json());

  //Routes
  express.use("/api/auth", routerAuth);

  express.listen(process.env.PORT, () => {
    console.log(`Server on port: ${process.env.PORT}`);
  });
};
