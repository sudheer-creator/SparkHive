import React from 'react'
import './Itemorder.css'
import {toast} from 'react-toastify'
import { useEffect,useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'
import { ShopContext } from "../../Context/ShopContext";
import { useParams } from 'react-router-dom';

const Itemorder = () => {


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
    const {itemid} = useParams();
    const [errors, setErrors] = useState({});

const { products, cartItems } = useContext(ShopContext);

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
}


function totalForProduct() { 
    const itemInfo = products.find(product => product.product_id === Number(itemid)); 

    return itemInfo ? itemInfo.price : 0;
  }
  


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
    else if (totalForProduct() === 0) {
        navigate('/cart')
    }
}, [localStorage.getItem("auth-token")])

    return (
  
      <form className='place-order mx-4'>
          <div className="place-order-left">
              <p className='title'>Delivery Information</p>
              <div className="multi-field">
                  <input type="text" name='firstName' onChange={onChangeHandler} value={formData.firstName} placeholder='First name' required />
                  <input type="text" name='lastName' onChange={onChangeHandler} value={formData.lastName} placeholder='Last name' required />
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
              <input type="text" name='phoneNumber' onChange={onChangeHandler} value={formData.phoneNumber} placeholder='Phone' required />
          </div>
          <div className="place-order-right">
              <div className="cart-total">
                  <h2>Cart Totals</h2>
                  <div>
                      <div className="cart-total-details"><p>Subtotal</p><p>INR {totalForProduct()}</p></div>
                      <hr />
                      <div className="cart-total-details"><p>Delivery Fee</p><p>INR {totalForProduct() === 0 ? 0 : 0.00}</p></div>
                      <hr />
                      <div className="cart-total-details"><b>Total</b><b>INR {totalForProduct() === 0 ? 0 : totalForProduct() + 5}</b></div>
                  </div>
              </div>
              <button
        className='place-order-submit'
        disabled={!isValidForm} // Disable button if form is not valid
        onClick={(event) => {
          event.preventDefault();
          if (isValidForm) {
            placeOrder(totalForProduct() + 5,formData);
          }
        }}
      >
        Proceed To Payment
      </button>
          </div>
      </form>
  )
  
}

export default Itemorder
