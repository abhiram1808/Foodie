import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 }, // ⭐ New field
    tags: { type: [String], default: [] } // 🏷 New field - array of strings
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
