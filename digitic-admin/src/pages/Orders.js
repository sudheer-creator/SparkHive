import React, { useEffect, useState } from 'react';
import "./Orders.css";

const Orders = () => {
    const [allOrders, setAllOrders] =useState([]);

    const fetchInfo =() => {
        fetch('http://localhost:3001/api/order') 
            .then((res) => res.json()) 
            .then((data) => setAllOrders(data))
    } 
    useEffect(() => {
        fetchInfo();
      }, [])
    
       
  return (
    <div className="orders">
      <h1>Orders</h1>
      <div className="listproduct-format-main">
          <p>S. No.</p>
          <p>Customer Name</p>
          <p>Product</p>
          <p>Amount</p>
          <p>Status</p>
          <p>Date</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allOrders.map((e) => {
          return (
            <div>
              <div className="listproduct-format-main listproduct-format">
              <p> {e.sr_no}</p>
                <p cartitems-product-title>{e.customer_name}<span> {e.customer_surname}</span></p>
                <p> {e.product_name}</p>
                <p> {e.total_amount}</p>
                <p>{e.status}</p>
                <p> {e.order_date}</p>
                </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Orders;