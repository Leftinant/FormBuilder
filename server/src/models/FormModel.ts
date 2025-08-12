import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true,
  },
  title: { type: String },
  imageUrl: { type: String },

  data: { type: Schema.Types.Mixed },
});

const FormSchema = new Schema(
  {
    title: String,
    description: String,
    headerImage: String,
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Form", FormSchema);
