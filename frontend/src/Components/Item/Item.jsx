import React from 'react'
import './Item.css'


const Item = (props) => {
  return (
    <div className='item'>
      <img src={props.image} alt="" />
      <p>{props.name}</p>
      <div className="item-prices">
            <div className="item-price-new">
                Rs {props.price}
            </div>
            <div className="item-price-old">
            Rs {props.offer_price}
            </div>
      </div>
    </div>

      // <div class="card">
      //         <h2>{props.name}</h2>
      //         <p><strong>Description:</strong></p>
      //         <p>{props.description}</p>
      //         <p><strong>Price:</strong> RS{props.price}</p>
      // </div>

//  <div className="item">{props.description}</div>

  )
}

export default Item
