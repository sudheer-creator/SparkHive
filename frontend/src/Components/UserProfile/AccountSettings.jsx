import React from 'react'
import './AccountSettings.css'
import { useState } from 'react';

const AccountSettings = () => {
  const numberRegex = /^[0-9]{10}$/;
  const validateNumber = (number) => {
    if (number === "") {
      return true;
    }
    return numberRegex.test(number);
  };

  const [formData,setFormData] = useState({firstname:"",phonenumber:"",lastname:"" ,email:"" ,id:`${localStorage.getItem('id')}`});
  const [Numerror, setNumError] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);

  const update=async ()=>{
    let dataObj;
      await fetch("http://localhost:3001/updateprofile", {
        method: 'POST',
        headers: {
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then((resp) => resp.json())
      .then((data) => dataObj=data);
  // here we will get the return value i.e object in dataObj variable eg success , error etc
      if (dataObj.errors) {
        alert(dataObj.errors)
      }
      if (dataObj.success) {
        console.log("profile updated")
        // navigate('/');
      }
      if (dataObj.message) {
        alert(dataObj.message)
        // navigate('/');
      }
   }
  

  const changeHandler =  (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    console.log(formData)
    if(e.target.name==="phonenumber"){
      const valid = validateNumber(e.target.value);
      setIsValidNumber(valid);
      if (!isValidNumber) {
        setNumError("Invalid Phone number. Please enter a 10-digit phone number");
      } else {
        setNumError(""); // Clear error on valid input
      }
    }
    
    
   }
  return (
    <div className='accountsettings'>
      <h1 className='mainhead1'>Personal Information</h1>

      <div className='form'>
        <div className='form-group'>
          <label htmlFor='firstname'>First Name <span>*</span></label>
          <input type='text' name='firstname' onChange={changeHandler} id='name' />
        </div>
        <div className='form-group'>
          <label htmlFor='lastname'>Last Name <span>*</span></label>
          <input type='text' name='lastname'  onChange={changeHandler} id='last_name' />
        </div>
        

        <div className='form-group'>
          <label htmlFor='phonenumber'>Phone/Mobile <span>*</span></label>
          <input type='text' name='phonenumber'  onChange={changeHandler} id='phone'/>
          {isValidNumber ? null : <p className="error">{Numerror}</p>}
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email <span>*</span></label>
          <input type='email' name='email' onChange={changeHandler} id='email'

          />
        </div>

      
      </div>

      <button className='bg-red-500 rounded px-4 py-3 text-white' onClick={update} style={{margin: "30px"}}>Save Changes</button>
    </div>
  )
}

export default AccountSettings