import React, { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const indianZipCodeRegex = /^[1-9][0-9]{5}$/;
  const numberRegex = /^[0-9]{10}$/;

  const validateIndianZipCode = (zipCode) => {
    return indianZipCodeRegex.test(zipCode);
  };
  const validateNumber = (number) => {
    return numberRegex.test(number);
  };

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({firstname:"",address:"",phonenumber:"",lastname:"" ,username:"",zipcode:"" ,email:"",password:""}); // default form data ( object with key value pair )
  const [isValid, setIsValid] = useState(true);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [error, setError] = useState('');
  const [Numerror, setNumError] = useState('');

  

  const changeHandler =  (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    console.log(formData)
    if(e.target.name==="zipcode"){
      const isValidZip = validateIndianZipCode(e.target.value);
      setIsValid(isValidZip);
      if (!isValidZip) {
        setError("Invalid Indian zip code. Please enter a 6-digit code starting with 1-9.");
      } else {
        setError(''); // Clear error on valid input
      }
    }
    if(e.target.name==="phonenumber"){
      const valid = validateNumber(e.target.value);
      setIsValidNumber(valid);
      if (!isValidNumber) {
        setNumError("Invalid Phone number. Please enter a 10-digit phone number");
      } else {
        setNumError(''); // Clear error on valid input
      }
    }
    
    
   }

   const login=async ()=>{
    let dataObj;
    console.log("login called")
      await fetch("http://localhost:3001/login", {
        method: 'POST',
        headers: {
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then((resp) => resp.json())
      .then((data) => dataObj=data);

      if (dataObj.errors) {
        alert(dataObj.errors)
      }
      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
   }
   const signup=async ()=>{
    let dataObj;
    await fetch("http://localhost:3001/signup", {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((res)=>res.json())
    .then((data)=>dataObj=data)
    if (dataObj.errors) {
      alert(dataObj.errors)
    }
    if (dataObj.message) {
      alert(dataObj.message)
    }
    
   }

  return (
    <div className="loginsignup">

      <div className="loginsignup-container">
         
         <h1>{state}</h1>
         <div className="loginsignup-fields">
         {state==="Sign up"?<><input type="text" placeholder="first name" name="firstname" value={formData.firstname} onChange={changeHandler}/></>:<></>} 
         {state==="Sign up"?<><input type="text" placeholder="last name" name="lastname" value={formData.lastname} onChange={changeHandler}/></>:<></>} 
         {state==="Sign up"?<><input type="text" placeholder="Your address" name="address" value={formData.address} onChange={changeHandler}/></>:<></>}  
         {state==="Sign up"?<><input type="text" placeholder="zipcode" name="zipcode" value={formData.zipcode} onChange={changeHandler}/></>:<></>}  
         {isValid ? null : <p className="error">{error}</p>}
         {state==="Sign up"?<><input type="tel" placeholder="Phone number" pattern="[0-9]{10}" required name="phonenumber" value={formData.phonenumber} onChange={changeHandler}/></>:<></>}
         {isValidNumber ? null : <p className="error">{Numerror}</p>}
         <input type="email" placeholder="Email address" name="email"  onChange={changeHandler}/> 
         <input type="password" placeholder="Password" name="password" onChange={changeHandler}/> 
         

         </div>

         <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>

         {state==="Login"?<p className="loginsignup-login" onClick={()=>setState("Sign up")}>Create an account <span onClick={()=>setState("Sign up")} >click here</span>
         </p>:<p className="loginsignup-login" onClick={()=>setState("Login")}>Already have an account ?<span onClick={()=>setState("Sign up")} >Login here</span></p>}

      </div>

    </div>
  )
}

export default LoginSignup
