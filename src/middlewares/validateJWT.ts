import { verify } from "jsonwebtoken";
import { RequestHandler } from "express";

type JwtPayload = {
  _id: string;
  email: string;
  name: string;
  surname: string;
  user: string;
};

export const validateJWT: RequestHandler = (req, res, next) => {
  const token = req.header("todoist-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "There is no token in the request.",
    });
  }

  try {
    const payload = verify(
      token,
      process.env.SECRET_JWT_SEED || ""
    ) as JwtPayload;

    const { _id, email, name, surname, user } = payload;

    req.body._id = _id;
    req.body.email = email;
    req.body.name = name;
    req.body.surname = surname;
    req.body.user = user;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Ivalid token.",
    });
  }
  next();
};
