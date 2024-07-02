import React, { useEffect, useState } from "react";
import "./Productlist.css";
import cross_icons from './Assets/cross_icons.svg'

const Productlist = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = () => { 
    fetch('http://localhost:3001/api/products') 
            .then((res) => res.json()) 
            .then((data) => setAllProducts(data))
    }

    useEffect(() => {
      fetchInfo();
    }, [])

    const removeProduct = async (id) => {
      await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify({id:id}),
    })

    fetch('http://localhost:3001/api/products') 
    .then((res) => res.json()) 
    .then((data) => setAllProducts(data))

    }

    const searchHandle = async (event)=>{
      let key=event.target.value;
      let result = await fetch (`http://localhost:5000/search/${key}`);
       result =await result.json()
      }

  return (
    <div className="productlist">
      <h1>All Products List</h1>
      <input type="" className="search-product" placeholder="Search Product"
      onChange={searchHandle}
      />

      <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>offer Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((e) => {
          return (
            <div>
              <div className="listproduct-format-main listproduct-format">
                <img className="listproduct-product-icon" src={e.image_url} alt="" />
                <p cartitems-product-title>{e.name}</p>
                <p>Rs {e.price}</p>
                <p>Rs {e.offer_price}</p>
                <p>{e.category_name}</p>
                <img className="listproduct-remove-icon" onClick={()=>{removeProduct(e.id)}} src={cross_icons} alt="" />
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Productlist;
