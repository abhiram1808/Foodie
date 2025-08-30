import { useEffect, useState } from "react";
import "./List.css";
import { url, currency } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateFoodModal from "../../components/UpdateFoodModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const List = () => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);

  // Fetch list from API
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching food list");
      }
    } catch (error) {
      toast.error("Failed to load food list");
      console.error(error);
    }
  };

  // Remove a food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message || "Error removing food");
      }
    } catch (error) {
      toast.error("Failed to remove food");
      console.error(error);
    }
  };

  // Open modal for editing
  const openEditModal = (food) => {
    setCurrentFood(food);
    setIsModalOpen(true);
  };

  // Save updated food
 const handleSave = async (formData) => {
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("category", formData.category);
  fd.append("price", formData.price);
  fd.append("tags", formData.tags);
  fd.append("rating", formData.rating);
  fd.append("description", formData.description);
  if (formData.image) {
    fd.append("image", formData.image);
  }

  try {
    const response = await axios.put(`${url}/api/food/update/${formData.id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
      setIsModalOpen(false);
    } else {
      toast.error(response.data.message || "Error updating food");
    }
  } catch (error) {
    toast.error("Update failed");
    console.error(error);
  }
};


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table-format title">
  <b>Image</b>
  <b>Name</b>
  <b>Category</b>
  <b>Price</b>
  <b>Action</b>
  <b>Description</b>
  <b>Tags</b>           {/* Added Tags header */}
  <b>Rating</b>         {/* Added Rating header */}
</div>
{list.map((item, index) => (
  <div key={index} className="list-table-format">
    <img src={`${url}/images/${item.image}`} alt={item.name} />
    <p>{item.name}</p>
    <p>{item.category}</p>
    <p>
      {currency}
      {item.price}
    </p>
    <p className="cursor" onClick={() => removeFood(item._id)}>
       <DeleteIcon style={{ color: "red", cursor: "pointer" }} />
    </p>
     <EditIcon
            onClick={() => openEditModal(item)}
            style={{ cursor: "pointer", marginLeft: 10, color: "#1976d2" }}
            title="Edit"
          />
    <p>{item.description}</p>
    <p>{item.tags}</p>           {/* Render tags */}
    <p>{item.rating}</p>         {/* Render rating */}
  </div>
))}


      <UpdateFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentFood={currentFood}
      />
    </div>
  );
};

export default List;
