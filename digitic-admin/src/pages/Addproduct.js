import React, { useState } from "react"; 
import "./AddProduct.css"; 
import upload_area from "./Assets/upload_area.svg"; 
 
const AddProduct = () => { 
 
  const[image,setImage] = useState(false); 
  const [setState] = useState("Productlist");
  const [productDetails,setProductDetails] = useState({ 
      name:"", 
      image:"", 
      category:"", 
      price:"", 
      offer_price:"", 
      description:"", 
      stock_quantity:"", 
      manufacturer:"", 
      weight:"", 
  }); 
 
  const AddProduct = async () => { 
     
    let dataObj; 
    let product = productDetails; 
    console.log("chala") 
    console.log(product) 
 
    let formData = new FormData(); 
    formData.append('product', image); 
     
    await fetch('http://localhost:3001/upload', { 
      method: 'POST', 
      headers: { 
        Accept:'application/json', 
      }, 
      body: formData, 
    }) 
      .then((resp) => resp.json()) 
      .then((data) => {console.log(data) ;dataObj=data}); 
    if (dataObj.success) 
     { 
      product.image = dataObj.image_url; 
      console.log(product); 
      await fetch('http://localhost:3001/api/add', { 
      method: 'POST', 
      headers: { 
        Accept:'application/json', 
        'Content-Type':'application/json', 
      }, 
      body: JSON.stringify(product), 
    }) 
      .then((resp) => resp.json()) 
      .then((data) => {data.success?alert("Product Added"):alert("Failed")}); 
       
    } 
  } 
 
  const changeHandler = (e) => { 
    console.log(e); 
    setProductDetails({...productDetails,[e.target.name]:e.target.value}); 
    } 
 
  const imageHandler = (e) => { 
    setImage(e.target.files[0]); 
    } 

    const handleGoclick = (e)=>{
          window.location.replace("/admin/list-product")
    }
 
  return ( 
    <div className="addproduct"> 
   
    <div className="button_box">
    <button className="addproduct-btn" onClick={handleGoclick} >Go to Products</button> 
    <h1 className="heading">Add Product</h1>
    <button className="addproduct-btn-right" onClick={()=>{AddProduct()}}>Create New</button> 
    </div>

      <div className="addproduct-itemfield"> 
        <p>Product title</p> 
        <input type="text" name="name" value={productDetails.name} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
      </div> 
      <div className="addproduct-itemfield"> 
        <p>Product Description</p> 
        <input type="text" name="description" value={productDetails.description} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
      </div> 
      <div className="addproduct-price"> 
        <div className="addproduct-itemfield"> 
          <p>Price</p> 
          <input type="text" name="price" value={productDetails.price} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
        </div> 
        <div className="addproduct-itemfield"> 
          <p>Offer Price</p> 
          <input type="text" name="offer_price" value={productDetails.offer_price} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
        </div> 
      </div> 
      <div className="addproduct-itemfield"> 
          <p>Stocks available </p> 
          <input type="number" name="stock_quantity" value={productDetails.stock_quantity} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
        </div> 
        <div className="addproduct-itemfield"> 
          <p>Manufacturer </p> 
          <input type="text" name="manufacturer" value={productDetails.manufacturer} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
        </div> 
        <div className="addproduct-itemfield"> 
          <p>Weight </p> 
          <input type="number" name="weight" value={productDetails.weight} onChange={(e)=>{changeHandler(e)}} placeholder="Type here" /> 
        </div> 
      <div className="addproduct-itemfield"> 
        <p>Product category</p> 
        <select value={productDetails.category} name="category" className="add-product-selector" onChange={changeHandler}> 
          <option value="Electronics">Electronics</option> 
          <option value="Audio">Audio</option> 
          <option value="Appliances">Appliance</option> 
          <option value="Fitness">Fitness</option>
          </select>  
      </div> 
      <div className="addproduct-itemfield"> 
        <p>Product title</p> 
        <label for="file-input"> 
          <img className="addproduct-thumbnail-img" src={!image?upload_area:URL.createObjectURL(image)} alt="" /> 
        </label> 
        <input onChange={(e)=>{imageHandler(e)}} type="file" name="image" id="file-input" hidden /> 
      </div> 
      <button className="addproduct-btn" onClick={()=>{AddProduct()}}>ADD</button> 
    </div> 
  ); 
}; 
 
export default AddProduct;