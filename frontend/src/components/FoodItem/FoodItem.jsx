import { useContext } from 'react'
import PropTypes from 'prop-types'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc , id, onClick }) => {

    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);

    // Accept onClick prop for modal
    const handleItemClick = (e) => {
        // Prevent modal open if clicking on cart buttons
        if (
            e.target.classList.contains('add') ||
            e.target.classList.contains('food-item-counter') ||
            e.target.classList.contains('remove')
        ) return;
        if (typeof onClick === 'function') onClick();
    };

    return (
        <div className='food-item' onClick={handleItemClick} style={{cursor: 'pointer'}}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url+"/images/"+image} alt="" />
                {!cartItems[id]
                ?<img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                :<div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)} alt="" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={()=>addToCart(id)} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

FoodItem.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    desc: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func,
}

export default FoodItem
