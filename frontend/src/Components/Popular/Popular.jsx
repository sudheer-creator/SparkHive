import React from 'react'
import {useState,useEffect} from 'react'
import './Popular.css'
import Item from '../Item/Item'
import axios from 'axios';
import { Link } from 'react-router-dom';


const Popular = ({item ,id}) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your-backend-api-endpoint' with the actual endpoint of your backend API
        fetch('http://localhost:3001/api/productsbycategory', {
          method: 'POST',
          headers: {
            Accept:'application/form-data',
            'auth-token':`${localStorage.getItem("auth-token")}`,
            'Content-Type':'application/json',
          },
          body: JSON.stringify({"category_id":id}),
        })
        .then((resp) => resp.json())
      .then((data) => {setProducts(data)});
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='popular'>
      <h1 className='bg-red-500 rounded px-5 py-3 text-white ' style={{color:"white"}}>Best of {item} </h1>

      <div className="popular-item flex">
        {
            products.map((item,i)=>{
              return(
        
                <Link  to ={`/product/${item.product_id}`}>
               
              <Item key={i} image ={item.image_url} description = {item.description} name = {item.name} price = {item.price} offer_price ={item.offer_price}/> 
              
              </Link>)
                // return <Item key={i} id = {item.product_id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price}/>
            })
        }
      </div>
    </div>
  )
}

export default Popular
