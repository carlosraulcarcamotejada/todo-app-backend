import { Router } from "express";
import {
  deleteUser,
  revalidateToken,
  signIn,
  signUp,
  updateUser,
  updateUserImg,
  updateUserPassword,
} from "../controllers/authController";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields";
import { validateJWT } from "../middlewares/validateJWT";

export const routerAuth = Router();

routerAuth.post(
  "/signup",
  [
    //Middlewares validators
    check("name").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("surname").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("email").not().isEmpty().isEmail(),
    check("password").not().isEmpty().isLength({ min: 6, max: 12 }),
    validateFields,
  ],
  signUp
);


routerAuth.put(
  "/:_id",
  [
    //Middlewares validators
    check("name").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("surname").not().isEmpty().isLength({ min: 3, max: 40 }),
    check("email").not().isEmpty().isEmail(),
    validateFields,
  ],
  updateUser
);


routerAuth.put("/updatepassword/:_id",
[
  //Middlewares validators
  check("actualPassword").not().isEmpty().isLength({ min: 6, max: 12 }),
  check("newPassword").not().isEmpty().isLength({ min: 6, max: 12 }),
  validateFields,
],
updateUserPassword);


routerAuth.put("/updateimg/:_id",
[
  //Middlewares validators
  check("userImg").not().isEmpty(),
  validateFields,
],
updateUserImg
);


routerAuth.post("/signin", signIn);

routerAuth.delete("/:_id", deleteUser);

routerAuth.get("/renew-token", validateJWT, revalidateToken);
