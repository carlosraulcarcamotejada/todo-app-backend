import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from "../controllers/todoController";

export const routerTodo = Router();

routerTodo.post("/", addTodo);

routerTodo.get("/:_id", getTodos);

routerTodo.delete("/:_id", deleteTodo);

routerTodo.put("/:_id", updateTodo);

routerTodo.put("/toggletodo/:_id", toggleTodo);
