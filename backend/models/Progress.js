import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completedLessons: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      section: { type: mongoose.Schema.Types.ObjectId },
      lesson: { type: mongoose.Schema.Types.ObjectId }
    }
  ]
});

export default mongoose.model("Progress", progressSchema);
