import { model, Schema } from "mongoose";

const questionsSchema = new Schema(
  {
    question: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    answer: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const questionsModel = model("questions", questionsSchema);
