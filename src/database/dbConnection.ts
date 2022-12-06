import { connect } from "mongoose";

export const dbConnection = async () => {
  try {
    const db = await connect(process.env.DB_CONNECTION || "");

    console.log(`Connected to: ${db.connection.name}`);
  } catch (error) {
    throw new Error("Error initializing database\n: " + error);
  }
};
