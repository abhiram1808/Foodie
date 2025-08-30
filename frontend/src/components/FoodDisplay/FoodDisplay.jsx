import React, { useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";
import FoodModal from "../FoodModal/FoodModal";
import { assets } from "../../assets/assets";
import { VscRefresh } from "react-icons/vsc";
const foodTypeColors = {
  veg: "#27ae60",
  "non-veg": "#c0392b",
  egg: "#d35400",
};

const FoodDisplay = ({ category }) => {
  const { food_list, addToCart, url } = useContext(StoreContext); // ✅ FIX: pulled addToCart and url

  // Filters
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");

  // Top Dishes state
  const [topDishes, setTopDishes] = useState([]);

  // Modal state
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [added, setAdded] = useState(false); // ✅ New state for feedback

  // Pick random dishes for "Top Dishes"
  const pickRandomDishes = useCallback(() => {
    if (food_list.length > 0) {
      const shuffled = [...food_list].sort(() => 0.5 - Math.random());
      setTopDishes(shuffled.slice(0, 4));
    }
  }, [food_list]);

  useEffect(() => {
    pickRandomDishes();
  }, [food_list, pickRandomDishes]);

  // Food Type filter buttons
  const foodTypeOptions = [
    { key: "all", label: "All", color: "#999" },
    { key: "veg", label: "Veg", color: foodTypeColors.veg },
    { key: "non-veg", label: "Non-Veg", color: foodTypeColors["non-veg"] },
    { key: "egg", label: "Egg", color: foodTypeColors.egg },
  ];

  // Filter food list
  const filteredFoods = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = !maxPrice || item.price <= parseFloat(maxPrice);
    const matchesRating = !minRating || item.rating >= parseFloat(minRating);
    const matchesFoodType =
      foodTypeFilter === "all" ||
      (item.tags && item.tags.map(tag => tag.toLowerCase()).includes(foodTypeFilter));

    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesFoodType;
  });

  // Modal handlers
  const openModal = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFood(null);
    setIsModalOpen(false);
    setAdded(false);
  };

  // ✅ New function for smooth "Added ✅" feedback
  const handleAddToCart = () => {
    addToCart(selectedFood._id);
    setAdded(true);
    setTimeout(() => {
      closeModal();
    }, 1000); // 1 second delay before closing
  };

  return (
    <div className="food-display" id="food-display">

      {/* Top Dishes Section */}
      {topDishes.length > 0 && (
        <div className="top-dishes-section">
          <div className="top-dishes-header">
            <h2> Top Dishes for You</h2>
            <button className="refresh-btn" onClick={pickRandomDishes}><VscRefresh /></button>
          </div>
          <div className="food-display-list top-dishes-list">
            {topDishes.map((item) => (
              <FoodItem
                key={`top-${item._id}`}
                image={item.image}
                name={item.name}
                price={item.price}
                id={item._id}
                foodType={item.foodType}
                small
                onClick={() => openModal(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Heading */}
      <h2>Top dishes near you</h2>

      {/* Food Type Filter Buttons */}
      <div className="food-type-filter">
        {foodTypeOptions.map(({ key, label, color }) => (
          <button
            key={key}
            className={`food-type-btn ${foodTypeFilter === key ? "active" : ""}`}
            style={{
              borderColor: color,
              color: foodTypeFilter === key ? "#fff" : color,
              backgroundColor: foodTypeFilter === key ? color : "transparent",
            }}
            onClick={() => setFoodTypeFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Other Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
          <option value="1">1★ & above</option>
        </select>
      </div>

      {/* Food Items */}
      <div className="food-display-list">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              id={item._id}
              foodType={item.foodType}
              desc={item.description || ""}
              onClick={() => openModal(item)}
            />
          ))
        ) : (
          <p>No matching items found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedFood && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content zomato-style" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              <img src={assets.cross_icon} alt="Close" style={{width:24,height:24}} />
            </button>

            {/* Large Image */}
            <div className="modal-image-wrapper">
              <img src={url + "/images/" + selectedFood.image} alt={selectedFood.name} className="modal-image" />
              {selectedFood.rating && (
                <span className="rating-badge">⭐ {selectedFood.rating}</span>
              )}
            </div>

            {/* Details */}
            <div className="modal-details">
              <div className="modal-header">
                <h2>{selectedFood.name}</h2>
                <span className="modal-price">₹{selectedFood.price}</span>
              </div>
              <p className="modal-description">{selectedFood.description}</p>
            </div>

            {/* Add to Cart & Instant Buy Buttons */}
            <div className="modal-footer">
              <button
                className={`add-to-cart-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? "Added ✅" : "Add to Cart"}
              </button>
              <button
                className="instant-buy-btn"
                onClick={async () => {
                  await addToCart(selectedFood._id);
                  window.location.href = "/cart";
                }}
              >
                <img src={assets.bag_icon} alt="Buy"  />
                <span className="instant-buy-btn" >Buy Instantly</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;
