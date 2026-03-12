import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true }, // Changed required to default
    fee: { type: Number, required: true },
    address: { type: Object, required: true }, // Lowercase 'a' recommended
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} } // Fixed syntax
}, { minimize: false });

// This check prevents error: "OverwriteModelError: Cannot overwrite `doctor` model once compiled."
const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;