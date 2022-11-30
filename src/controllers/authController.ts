import { RequestHandler } from "express";
import { User } from "../models/UserModel";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT";
import { validEmail } from "../regex/validEmail";

export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        controller: "signUp",
        message: "User already exists.",
        ok: false,
      });
    }

    user = new User(req.body);

    //Encrypt the password
    const salt = genSaltSync();
    user.password = hashSync(password, salt);

    await user.save();

    const token = await generateJWT({
      ...user,
      _id: user._id.toString(),
    });

    return res.status(200).json({
      ...user,
      controller: "signUp",
      message: "Sign up successfully.",
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "signUp",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};

export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email_user, password } = req.body;

    const isEmail = validEmail.test(email_user) ? true : false;

    
    let user = await User.findOne({
      [isEmail ? "email" : "user"]: email_user,
    });

    if (!user) {
      return res.status(400).json({
        controller: "signIn",
        message: "User does not exist.",
        ok: false,
      });
    }

    const validPassword = compareSync(password, user?.password || "");

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        controller: "signIn",
        message: "Invalid password.",
      });
    }

    const token = await generateJWT({
      _id: user?._id as unknown as string,
      email: user?.email || "",
      name: user?.name || "",
      surname: user?.surname || "",
      user: user?.user || "",
    });

    return res.status(200).json({
      ...user,
      controller: "signIn",
      message: "Sign in successfully.",
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
        controller: "signIn",
        error,
        message: "Please contact the administrator.",
        ok:false,
    })
  }
};
