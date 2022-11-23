import { app } from "./app";
import { dbConnection } from "./database/dbConnection";

dbConnection();
app();
