import React from 'react'
import { useContext } from 'react';
import { ShopContext } from "../../Context/ShopContext";

const Orders = () => {

    const {orders} = useContext(ShopContext);
    console.log(orders)

  return (
    <div>
       {orders.map((item)=>{
            return <div>
               { item.order_id}
            </div>
       })
        
       }
    </div>
  )
}

export default Orders
