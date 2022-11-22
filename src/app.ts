import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();





export const app = () => {
  const express = Express();

  express.use(cors());

  express.use(Express.json());

  express.listen(process.env.PORT, () => {
    console.log(`Server on port: ${process.env.PORT}`);
  });
};
