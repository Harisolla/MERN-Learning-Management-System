import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Text, video URL, etc.
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sections: [sectionSchema],
    attachments: { type: [String], default: [] }, // Only one global array for PDFs
  },
  { timestamps: true }
);


export default mongoose.model("Course", courseSchema);
