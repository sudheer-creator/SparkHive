import React from 'react'
import './Order.css'
import {toast} from 'react-toastify'
import { useEffect,useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { ShopContext } from "../../Context/ShopContext";


const Order = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '', // Use address_line1 from schema
    addressLine2: '', // Use address_line2 from schema
    city: '',
    state: '',
    postalCode: '', // Use postal_code from schema
    phoneNumber: '',
    isDefault: false, // Use is_default from schema (default to false)
  });
  const [isValidForm, setIsValidForm] = useState(false);
  const [errors, setErrors] = useState({});

const { getTotalCartAmount, products, cartItems } = useContext(ShopContext);

const navigate = useNavigate();

const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(formData => ({ ...formData, [name]: value }))
    
    setErrors({
        ...(errors || {}), // Preserve existing errors
        [name]: !value ? 'This field is required.' : '',
      });

      const isValid =
      formData.firstName &&
      formData.lastName &&
      formData.addressLine1 &&
      formData.city &&
      formData.state &&     
      formData.postalCode &&
      formData.phoneNumber;
    setIsValidForm(isValid);

};

// const placeOrder = async (e) => {
//     e.preventDefault()
//     let orderItems = [];
//     products.map(((item) => {
//         if (cartItems[item._id] > 0) {
//             let itemInfo = item;
//             itemInfo["quantity"] = cartItems[item._id];
//             orderItems.push(itemInfo)
//         }
//     }))
//     let orderData = {
//         address: formData,
//         items: orderItems,
//         amount: getTotalCartAmount() + 5,
//     }
//     // let response = await axios.post(url + "/api/order/place", orderData, { headers:  token });// yaha problem hein 
//     // if (response.data.success) {
//     //     const { session_url } = response.data;
//     //     window.location.replace(session_url);
//     // }
//     // else {
//     //     toast.error("Something Went Wrong")
//     // }


// }

// const placeOrder = async (amount) => {

//     const { data: { key } } = await axios.get("http://www.localhost:3001/api/getkey")

//     const { data: { order } } = await axios.post("http://localhost:3001/api/checkout",{amount})
    
//     console.log({order});

//     const options = {
//         key,
//         amount,
//         currency: "INR",
//         name: "NEERAJ SINGH",
//         description: "Tutorial of RazorPay",
//         image: "",
//         order_id: order.id,
//         // callback_url: "",
//         prefill: {
//             name: "Neeraj Singh",
//             email: "neeraj.singh@example.com",
//             contact: "9999999999"
//         },
//         notes: {
//             "address": "Razorpay Corporate Office"
//         },
//         theme: {
//             "color": "#121212"
//         }
//     };
//    // const razor = new window.Razorpay(options);
//        const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
// }
// const placeOrder = async (amount) => {
//     try {
//       // Get the Razorpay key
//       const keyResponse = await axios.get("http://www.localhost:3001/api/getkey");
//       if (!keyResponse.data || !keyResponse.data.key) {
//         throw new Error("Failed to retrieve Razorpay key. Please check the API endpoint.");
//       }
//       const key = keyResponse.data.key;
  
//       // Create the order
//       const orderResponse = await axios.post("http://localhost:3001/api/checkout", amount);
//       if (!orderResponse.data || !orderResponse.data.order || !orderResponse.data.order.id) {
//         throw new Error("Failed to create order. Please check the checkout API endpoint.");
//       }
//       const order = orderResponse.data.order;
  
//       // Configure Razorpay options
//       const options = {
//         key,
//         amount: 500, // Assuming amount is passed as an argument
//         currency: "INR",
//         name: "NEERAJ SINGH",
//         description: "Tutorial of RazorPay",
//         image: "",
//         order_id: order.id,
//         callback_url: "http://localhost:3001/api/paymentverification",
//         prefill: {
//           name: "Neeraj Singh",
//           email: "neeraj.singh@example.com",
//           contact: "9999999999"
//         },
//         notes: {
//           "address": "Razorpay Corporate Office"
//         },
//         theme: {
//           "color": "#121212"
//         }
//       };
  
//       // Create and open the Razorpay instance
//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (error) {
//       console.error("Error placing order:", error);
//       // Handle the error here (e.g., display an error message to the user)
//     }
//   };
const placeOrder = async (amount,formData) => {

    if(localStorage.getItem("auth-token"))
    {
      fetch('http://localhost:3001/api/storeshippingaddress', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'auth-token':`${localStorage.getItem("auth-token")}`,
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((err) => console.log(err))
    }

      // 2. Create Order on Backend
      await axios.post("http://localhost:3001/api/checkout",{amount})
      .then(
          res=>{
              console.log("response from checkout id:",res.data.order.id);
  
  
       //3. Create Razorpay Payment Object
    
       const options = {
        key:"rzp_test_GHSiaTeuXqZLCT",
        amount:amount*100,
        currency: "INR",
        name: "NEERAJ SINGH",
        description: "Tutorial of RazorPay",
        image: "",
        order_id: res.data.order.id,
        callback_url: "http://localhost:3001/api/paymentverification", 
        prefill: {
          name: "NEERAJ SINGH",
          email: "neeraj199322@gmail.com",
          contact: "9354010210"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        }
      };
    

  
      const razorpay = new window.Razorpay(options);
  
      // 4. Open Razorpay Payment Page
       razorpay.open(); // Initiate payment flow

          }
        
    ).catch(
      error=>{console.log(error)
      }
  )
  };

useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
        alert("to place an order sign in first")
        navigate('/login')
    }
    else if (getTotalCartAmount() === 0) {
        navigate('/cart')
    }

}, [localStorage.getItem("auth-token")])

    return (
  
      <form className='place-order mx-4'>
          <div className="place-order-left px-6">
              <p className='title'>Delivery Information</p>
              <div className="multi-field">
                  <input type="text" name='firstName' onChange={onChangeHandler} value={formData.firstName} placeholder='First name' required className={errors.firstName && 'error-input'}/>
                  <input type="text" name='lastName' onChange={onChangeHandler} value={formData.lastName} placeholder='Last name' required className={errors.lastName && 'error-input'} />
              </div>
              <input type="email" name='email' onChange={onChangeHandler} value={formData.email} placeholder='Email address' required />
              <div className="input-group">
    <label htmlFor="addressLine1">Address Line 1</label>
    <input
      type="text"
      id="addressLine1"
      name="addressLine1"
      value={formData.addressLine1} // Assuming you have this in your state
      onChange={onChangeHandler}
      required
    />
  </div>
  <div className="input-group">
    <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
    <input  type="text" id="addressLine2" name="addressLine2" value={formData.addressLine2} // Assuming you have this in your state
      onChange={onChangeHandler}
    />
  </div>
              <div className="multi-field">
                  <input type="text" name='city' onChange={onChangeHandler} value={formData.city} placeholder='City' required />
                  <input type="text" name='state' onChange={onChangeHandler} value={formData.state} placeholder='State' required />
              </div>
              <div className="multi-field">
                  <input type="text" name='postalCode' onChange={onChangeHandler} value={formData.postalCode} placeholder='Postal code' required />
                 
              </div>
              <input type="text" name='phoneNumber' onChange={onChangeHandler} value={formData.phoneNumber} placeholder='Phone' required className={errors.phoneNumber && 'error-input'} />
          </div>
          <div className="place-order-right">
              <div className="cart-total">
                  <h2>Cart Totals</h2>
                  <div>
                      <div className="cart-total-details"><p>Subtotal</p><p>INR {getTotalCartAmount()}</p></div>
                      <hr />
                      <div className="cart-total-details"><p>Delivery Fee</p><p>INR {getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                      <hr />
                      <div className="cart-total-details"><b>Total</b><b>INR {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
                  </div>
              </div>

              {Object.entries(errors).length > 0 && (
      <div className="error-message">Please fix the following errors:</div>
    )}
    {Object.entries(errors).map(([field, message]) => (
      <p key={field} className="error-message">
        {field}: {message}
      </p>
    ))}

              <button
        className='place-order-submit'
        disabled={!isValidForm} // Disable button if form is not valid
        onClick={(event) => {
          event.preventDefault();
          if (isValidForm) {
            placeOrder(getTotalCartAmount() + 5,formData);
          }
        }}
      >
        Proceed To Payment
      </button>

          </div>
      </form>
  )
  
}

export default Order
