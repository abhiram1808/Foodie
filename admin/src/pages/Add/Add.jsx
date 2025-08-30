import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        rating: 0,
        tags: ""
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("rating", Number(data.rating));
        // Convert comma-separated tags to array
        formData.append("tags", JSON.stringify(data.tags.split(",").map(tag => tag.trim())));
        formData.append("image", image);

        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad",
                rating: 0,
                tags: ""
            });
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                {/* Image Upload */}
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <input 
                        onChange={(e) => { setImage(e.target.files[0]); e.target.value = ''; }} 
                        type="file" 
                        accept="image/*" 
                        id="image" 
                        hidden 
                    />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>

                {/* Product Name */}
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
                </div>

                {/* Description */}
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Write content here' required />
                </div>

                {/* Category & Price */}
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burgers</option>
                            <option value="Drinks">Drinks</option>
                            <option value="Biriyani">Biriyani</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input type="number" name='price' onChange={onChangeHandler} value={data.price} placeholder='25' required />
                    </div>
                </div>

                {/* Star Rating */}
                <div className='add-rating flex-col'>
                    <p>Star Rating (0-5)</p>
                    <input type="number" name='rating' min="0" max="5" step="0.5" onChange={onChangeHandler} value={data.rating} />
                </div>

                {/* Tags */}
                <div className='add-tags flex-col'>
                    <p>Tags (comma separated)</p>
                    <input type="text" name='tags' onChange={onChangeHandler} value={data.tags} placeholder="Spicy, Vegan, Gluten-Free" />
                </div>

                {/* Submit */}
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;
