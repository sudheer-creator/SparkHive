import React, { createContext, useEffect, useState } from "react";


export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [products,setProducts] = useState([]);
  const [orders,setOrders] = useState([]);
  const [token,setToken] =useState("");
  
  const getDefaultCart = () => {
    let cart = {};
    // i ki values hi product id ko map kr rhi h
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    return cart;
  };
  const [cartItems, setCartItems] = useState(getDefaultCart());
  // useEffect is giving the no of items of particular product-id which we are storing in an array 
  useEffect(() => {
    async function loadData() {
     
      if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"))
      }
  }
  loadData()

    fetch('http://localhost:3001/api/products') 
          .then((res) => res.json()) 
          .then((data) => setProducts(data))
  //  below logic is defined as if anyone is not invoking any fn then this will always run and fetch
  //   the latest items present in cartItems and displays
    if(localStorage.getItem("auth-token"))
    {
      fetch('http://localhost:3001/getcart', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'auth-token':`${localStorage.getItem("auth-token")}`,
        'Content-Type':'application/json',
      },
      body: JSON.stringify(),
    })
      .then((resp) => resp.json())
      .then((data) => 
      {data.map((items)=>setCartItems((prev) => ({ ...prev, [items.product_id]: prev[items.product_id] + items.quantity })))});
    }
    if(localStorage.getItem("auth-token"))
    {
      fetch('http://localhost:3001/api/orderid',{
        method: 'POST',
        headers: {
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem("auth-token")}`,
          'Content-Type':'application/json',
        },
        body: JSON.stringify(),
      })
      .then((resp) => resp.json())
      .then((data) => setOrders(data));
    }

}, [])
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.product_id === Number(item));
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  }; 

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];;
      }
    }
    return totalItem;
  };



  const addToCart = async (itemId) => {
   
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
   
    if(localStorage.getItem("auth-token"))
    {

      fetch('http://localhost:3001/addtocart', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'auth-token':`${localStorage.getItem("auth-token")}`,
        'Content-Type':'application/json',
      },
      body: JSON.stringify({"itemId":itemId, "quantity" : cartItems[itemId]+1})
    })
      .then((resp) => resp.json())
      .then((data) => {console.log(data)});
    }
  };
  // const addToCart = async (itemId) => {
  //   // Update state first (synchronous)
  //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  
  //   // Create a Promise that resolves immediately
  //   const stateUpdatePromise = new Promise((resolve) => resolve());
  
  //   // Chain the API call after state update
  //   return stateUpdatePromise.then(() => {
  //     if (localStorage.getItem("auth-token")) {
  //       return fetch('http://localhost:3001/addtocart', {
  //           method: 'POST',
  //           headers: {
  //             Accept: 'application/form-data',
  //             'auth-token': `${localStorage.getItem("auth-token")}`,
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ "itemId": itemId, "quantity": cartItems[itemId] }),
  //         })
  //         .then((resp) => resp.json())
  //         .then((data) => {
  //           console.log(data);
  //           return data; // You can return data from the API call here
  //         });
  //     }
  //   });
  // };
  

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(localStorage.getItem("auth-token"))
    {
      fetch('http://localhost:3001/removefromcart', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'auth-token':`${localStorage.getItem("auth-token")}`,
        'Content-Type':'application/json',
      },
      body: JSON.stringify({"itemId":itemId}),
    })
      .then((resp) => resp.json())
      .then((data) => {console.log(data)});
    }
  };

  const contextValue = {orders, products, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount,token };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
