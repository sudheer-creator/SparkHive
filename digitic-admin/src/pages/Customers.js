import React, { useEffect, useState } from 'react';
import "./Customers.css";

const Customers = () => {
    const [allcustomers, setAllCustomers] =useState([]);

    const fetchInfo =() => {
        fetch('http://localhost:3001/api/customer') 
            .then((res) => res.json()) 
            .then((data) => setAllCustomers(data))
    } 
    useEffect(() => {
        fetchInfo();
      }, [])
    
       
  return (
    <div className="customers">
      <h1>Customers</h1>
      <div className="listproduct-format-main">
          <p>S. No.</p>
          <p>Name</p>
          <p>Email</p>
          <p>Address</p>
          <p>Mobile</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allcustomers.map((e) => {
          return (
            <div>
              <div className="listproduct-format-main listproduct-format">
              <p> {e.customer_id}</p>
                <p cartitems-product-title>{e.first_name}<span> {e.last_name}</span></p>
                <p> {e.email}</p>
                <p> {e.address}</p>
                <p>{e.phone_number}</p>
                </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Customers;