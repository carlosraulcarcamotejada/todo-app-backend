import { RequestHandler } from "express";
import { User } from "../models/UserModel";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT";
import { validEmail } from "../regex/validEmail";

export const signUp: RequestHandler = async (req, res) => {
  try {
    const { user, email, password } = req.body;

    let userDB = await User.findOne({ email:email?.toLowerCase() });
    if (userDB) {
      return res.status(400).json({
        controller: "signUp",
        message: "User already exists with this email.",
        ok: false,
      });
    }

    userDB = await User.findOne({ user });
    if (userDB) {
      return res.status(400).json({
        controller: "signUp",
        message: "This user already existis.",
        ok: false,
      });
    }

    userDB = new User({...req.body,email:req.body.email?.toLowerCase()});

    //Encrypt the password
    const salt = genSaltSync();
    userDB.password = hashSync(password, salt);

    await userDB.save();

    const token = await generateJWT({
      ...userDB,
      _id: userDB._id.toString(),
    });

    return res.status(200).json({
      ...userDB,
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

    const isEmail = validEmail.test(email_user?.toLowerCase()) ? true : false;

    let user = await User.findOne({
      [isEmail ? "email" : "user"]: isEmail?email_user?.toLowerCase():email_user,
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
      ok: false,
    });
  }
};
