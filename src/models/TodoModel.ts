import { model, Schema } from "mongoose";

const TodoSchema = new Schema(
  {
    todoTitle: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    _id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todoGoals: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          deadline: {
            type: Number,
            required: true,
          },
          done: {
            type: Boolean,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const Todo = model("Todo", TodoSchema);
