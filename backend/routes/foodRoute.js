// routes/foodRoutes.js
import express from 'express';
import { addFood, listFood, removeFood, getFoodById, updateFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

foodRouter.get("/list", listFood);
foodRouter.get("/:id", getFoodById); // Fetch single food
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.put("/update/:id", upload.single('image'), updateFood); // Update food
foodRouter.post("/remove", removeFood);

export default foodRouter;
