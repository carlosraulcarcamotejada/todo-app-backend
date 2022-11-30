import { sign } from "jsonwebtoken";


export type tokenPayload = {
  _id: string;
  email: string;
  name: string;
  surname: string,
  user: string;
}

export const generateJWT = (payload: tokenPayload): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    sign(payload, process.env.SECRET_JWT_SEED || "", (error, token) => {
      if (error) {
        console.log(error);
        reject("Failed to generate token.");
      }
      resolve(token);
    });
  });
};
