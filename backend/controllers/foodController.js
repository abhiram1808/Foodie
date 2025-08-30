import foodModel from "../models/foodModel.js";
import fs from 'fs';

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Add food
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;

        // Clamp rating between 0 and 5
        let safeRating = Number(req.body.rating);
        if (isNaN(safeRating)) safeRating = 0;
        if (safeRating > 5) safeRating = 5;
        if (safeRating < 0) safeRating = 0;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            rating: safeRating,
            tags: req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()) : []
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, () => {});
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Update food
const updateFood = async (req, res) => {
    try {
        const existingFood = await foodModel.findById(req.params.id);
        if (!existingFood) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // If a new image is uploaded, delete old image
        let updatedImage = existingFood.image;
        if (req.file) {
            
            fs.unlink(`uploads/${existingFood.image}`, () => { });
            updatedImage = req.file.filename;
        }

        // Update fields (keep old values if not provided)
        existingFood.name = req.body.name || existingFood.name;
        existingFood.description = req.body.description || existingFood.description;
        existingFood.price = req.body.price || existingFood.price;
        existingFood.category = req.body.category || existingFood.category;
        existingFood.type = req.body.type || existingFood.type;
        // Clamp rating between 0 and 5
        if (req.body.rating !== undefined) {
            let safeRating = Number(req.body.rating);
            if (safeRating > 5) safeRating = 5;
            if (safeRating < 0) safeRating = 0;
            existingFood.rating = safeRating;
        }
        existingFood.tags = req.body.tags ? req.body.tags.split(",") : existingFood.tags;
        existingFood.image = updatedImage;

        await existingFood.save();

        res.json({ success: true, message: "Food updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating food" });
    }
};


const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching food" });
    }
};
export { listFood, addFood, removeFood, updateFood,getFoodById };
