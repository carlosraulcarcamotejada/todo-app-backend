import { RequestHandler } from "express";
import { Todo } from "../models/TodoModel";

//======================== To add a Todo ============================
export const addTodo: RequestHandler = async (req, res) => {
  try {
    const newTodo = new Todo(req.body);

    const savedTodo = await newTodo.save();

    return res.status(201).json({
      ok: true,
      controller: "addTodo",
      message: "Todo created succesfully.",
      savedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "addTodo",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};

//======================== To get the Todos ============================
export const getTodos: RequestHandler = async (req, res) => {
  try {
    const _id = req.params?._id || "";
    const todos = await Todo.find({ _id_user: _id });

    if (!todos) {
      return res.status(404).json({
        ok: false,
        message: "the user does not have todos.",
        controller: "getTodos",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Todos obtained successfully.",
      controller: "getTodos",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "getTodos",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};

//======================== To update an individual Todo ============================
export const updateTodo: RequestHandler = async (req, res) => {
  try {
    const _id = req.params?._id || "";
    const _id_user = req.body?._id || "";

    const todo = await Todo.findById(_id);

    if (!todo) {
      return res.status(404).json({
        ok: false,
        controller: "editTodo",
        message: "Record not found.",
      });
    }

    if (_id_user !== todo._id_user.valueOf()) {
      return res.status(401).json({
        ok: false,
        controller: "editTodo",
        message: "You do not have privileges to edit this todo.",
      });
    }

    const toUpdateTodo = new Todo({ ...req.body, _id: todo._id });

    const updatedTodo = await Todo.findByIdAndUpdate(_id, toUpdateTodo, {
      new: true,
    });

    return res.status(200).json({
      ok: true,
      controller: "editTodo",
      message: "Todo updated successfully.",
      updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "editTodo",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};

//======================== To toggle a goal from a Todo ============================
export const toggleTodo: RequestHandler = async (req, res) => {
  try {
    const _id = req.params?._id || "";
    const { _id_user, _id_todo_goal } = req.body || "";

    let todo = await Todo.findById({ _id });

    if (!todo) {
      return res.status(404).json({
        ok: false,
        controller: "editTodo",
        message: "Record not found.",
      });
    }

    if (_id_user !== todo._id_user.valueOf()) {
      return res.status(401).json({
        ok: false,
        controller: "editTodo",
        message: "You do not have privileges to toggle this todo goal.",
      });
    }

    let totalComlpeteTodoGoals: number = 0;

    todo.todoGoals = todo.todoGoals.map((todoGoal) => {
      const tempTodoGoal: any = todoGoal;
      if (tempTodoGoal._id?.valueOf() === _id_todo_goal) {
        tempTodoGoal.done = !todoGoal.done;
      }
      todoGoal.done&&totalComlpeteTodoGoals++;

      return tempTodoGoal;
    });

    totalComlpeteTodoGoals === todo.todoGoals.length
      ? (todo.completed = true)
      : (todo.completed = false);

    const updatedTodo = await Todo.findByIdAndUpdate(_id, todo, {
      new: true,
    });

    return res.status(200).json({
      ok: true,
      controller: "toggleTodo",
      message: "Toggle todo goal successfully.",
      updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "toggleTodo",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};

//======================== To delete an individual Todo ============================
export const deleteTodo: RequestHandler = async (req, res) => {
  try {
    const _id = req.params?._id || "";
    const { _id_user } = req.body || "";
    const todo = await Todo.findById(_id);

    if (!todo) {
      return {
        ok: false,
        controller: "deleteTodo",
        message: "Record not found.",
      };
    }

    if (_id_user !== todo._id_user.valueOf()) {
      return res.status(401).json({
        ok: false,
        controller: "deleteTodo",
        message: "You do not have privileges to delete this todo.",
      });
    }

    const deletedTodo = await Todo.findByIdAndDelete(_id);

    return res.status(200).json({
      ok: true,
      message: "Todo erased successfully",
      controller: "deleteTodo",
      deletedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      controller: "deleteTodo",
      error,
      message: "Please contact the administrator.",
      ok: false,
    });
  }
};
