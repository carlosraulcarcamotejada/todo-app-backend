import { RequestHandler } from "express";
import { User } from "../models/UserModel";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT";

export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email?.toLowerCase() });
    if (user) {
      return res.status(400).json({
        controller: "signUp",
        message: "User already exists with this email.",
        ok: false,
      });
    }

    user = new User({ ...req.body, email: req.body.email?.toLowerCase() });

    //Encrypt the password
    const salt = genSaltSync();
    user.password = hashSync(password, salt);

    await user.save();

    const token = await generateJWT({
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
    const { email, password } = req.body;

    let user = await User.findOne({ email });

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
      ok: false,
    });
  }
};

export const revalidateToken: RequestHandler = async (req, res) => {
  try {
    const { _id } = req.body;
    const token = await generateJWT(req.body);

    const user = await User.findOne({ _id });

    return res.json({
      ok: true,
      controller: "revalidateToken",
      message: "renewtoken",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      controller: "revalidateToken",
      message: "Please contact the administrator.",
    });
  }
};
