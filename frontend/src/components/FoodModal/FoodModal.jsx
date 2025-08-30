import React from "react";
import PropTypes from "prop-types";
import "./FoodModal.css";

const FoodModal = ({ food, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <img src={food.image} alt={food.name} className="modal-image" />
        <h2>{food.name}</h2>
        <p>{food.desc}</p>
        <p className="price">₹{food.price}</p>
        <button className="order-btn">Add to Cart</button>
      </div>
    </div>
  );
};

FoodModal.propTypes = {
  food: PropTypes.shape({
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FoodModal;
