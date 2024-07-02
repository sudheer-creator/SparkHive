import React, {useEffect, useState } from "react";
import "./Categorylist.css";
import upload_area from "./Assets/upload_area.svg"; 

const Categorylist = () => {
    const [allCategories, setAllCategories] = useState([]);
    
    const fetchInfo = () => { 
        fetch('http://localhost:3001/api/categories') 
                .then((res) => res.json()) 
                .then((data) => setAllCategories(data))
        }
    
        useEffect(() => {
          fetchInfo();
        }, [])


  return (
    
    <div className="categorieslist">
      <h1>All categories List</h1>
      <input type="" className="search-product" placeholder="Search Product"
      />

      <div className="listproduct-format-main">
          <p>Category name</p>
        </div>
      <div className="listproduct-allproducts">
        <hr />
        {allCategories.map((e) => {
          return (
            <div>
              <div className="listproduct-format-main listproduct-format">
                <p cartitems-product-title>{e.category_name}</p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default Categorylist;
