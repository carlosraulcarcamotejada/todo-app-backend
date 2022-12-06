import { sign } from "jsonwebtoken";
import { JwtPayload } from "../types/JwtPayload";

export const generateJWT = (
  payload: JwtPayload
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      process.env.SECRET_JWT_SEED || "",
      // { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Failed to generate token.");
        }
        resolve(token);
      }
    );
  });
};
