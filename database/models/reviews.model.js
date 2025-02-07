import { model, Schema } from "mongoose";

const reviewsSchema = new Schema(
  {
    Image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    country: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    rate: {
      type: Number,
      required: true,
      enum: [1.0, 2.0, 3.0, 4.0, 5.0],
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customId: String,
  },
  { timestamps: true }
);

export const reviewsModel = model("Reviews", reviewsSchema);
