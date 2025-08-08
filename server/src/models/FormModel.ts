import mongoose, { Schema, Document } from "mongoose";

export type QuestionType = "categorize" | "cloze" | "comprehension";

export interface Question {
  type: QuestionType;
  text: string;
  image?: string;
  metadata: any;
}

export interface IForm extends Document {
  title: string;
  description?: string;
  headerImage?: string;
  questions: Question[];
  responses?: any[];
}

const QuestionSchema = new Schema<Question>({
  type: { type: String, required: true },
  text: { type: String, required: true },
  image: String,
  metadata: Schema.Types.Mixed,
});

const FormSchema = new Schema<IForm>({
  title: { type: String, required: true },
  description: String,
  headerImage: String,
  questions: [QuestionSchema],
  responses: [Schema.Types.Mixed],
});

export default mongoose.model<IForm>("Form", FormSchema);
