import { Router } from "express";
import { signIn, signUp } from "../controllers/authController";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields";

export const routerAuth = Router();

routerAuth.post(
  "/signup",
  [
    //Middlewares validators
    check("name").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("surname").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("email").not().isEmpty().isEmail(),
    check("password").not().isEmpty().isLength({ min: 6, max: 12 }),
    check("user").not().isEmpty().isLength({ min: 3, max: 40 }),
    validateFields,
  ],
  signUp
);

routerAuth.post("/signin", signIn);
