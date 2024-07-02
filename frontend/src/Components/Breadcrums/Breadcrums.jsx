import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrums = (props) => {
  const product = props.product
  return (
    <div className='breadcrums'>
      {/* HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" />  <img src={arrow_icon} alt="" /> {product[0].name}  */}
      HOME <img src={arrow_icon} alt="" /> {product[0].name} 
    </div>
  )
}

export default Breadcrums
