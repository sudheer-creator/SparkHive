import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from 'react-router-dom';

const ProductDisplay = (props) => {
  
  // we are making a central ShopContext for to use in all components
  const product = props.product;
  // here we are using this in this component 
  const {addToCart} = useContext(ShopContext); 
  const navigate = useNavigate();
  const handleBuyNowClick = () => {
    navigate(`/orders/${product.product_id || ''}`);
  };
  
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image_url} alt="img" />
          <img src={product.image_url} alt="img" />
          <img src={product.image_url} alt="img" />
          <img src={product.image_url} alt="img" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image_url} alt="img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.price}</div>
          <div className="productdisplay-right-price-new">${product.offer_price}</div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>
        {/* <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div> */}
        <button className="add-to-cart" onClick={()=>{addToCart(product.product_id)}}>ADD TO CART</button>
        
  <button
        style={{ textDecoration: 'none', color: '#fff' }}
        className="buy-now-button"
        onClick={()=>navigate(`/itemorder/${product.product_id}`)}
      >
        Buy Now
      </button>
    
        <p className="productdisplay-right-category"><span>Category :</span> {product.s}</p>
        <p className="productdisplay-right-category"><span>Tags :</span> Modern, Latest</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
