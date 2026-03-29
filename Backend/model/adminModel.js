import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
