import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const UpdateFoodModal = ({ isOpen, onClose, onSave, currentFood }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    tags: "",
    rating: 0,
    description: "",
    image: null,
  });

  useEffect(() => {
    if (currentFood) {
      setFormData({
        name: currentFood.name || "",
        category: currentFood.category || "",
        price: currentFood.price || "",
        tags: currentFood.tags || "",
        rating: currentFood.rating || 0,
        description: currentFood.description || "",
        image: null,
      });
    }
  }, [currentFood]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    // Pass formData + id from currentFood to onSave
    onSave({
      ...formData,
      id: currentFood?._id,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Food</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Food Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: "0.1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </Button>
            {formData.image && (
              <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                Selected: {formData.image.name}
              </p>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFoodModal;
