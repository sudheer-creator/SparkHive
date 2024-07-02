import React, { useContext } from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import { Carousel } from "antd";
import { ShopContext } from "../Context/ShopContext";
import Footer from '../Components/Footer/Footer';
import NewCollection from '../Components/NewCollection/NewCollection';
import NewArrivals from '../Components/NewArrivals/NewArrivals';
const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};


const Shop = () => {
  const {products} =useContext(ShopContext)
  return (
    <div>
    <Carousel autoplay>
         <div>
            <img style={{width:"100%"}}src="http://localhost:3001/images/Simple%20Modern%20Photo%20Collage%20Autumn%20Fashion%20Sale%20Banner.jpg" alt="" />
          </div>
         <div>
            <img style={{width:"100%"}}src="http://localhost:3001/images/Simple Modern Photo Collage Autumn Fashion Sale Banner-2.jpg" alt="" />
          </div>
     </Carousel>
     <NewCollection/>
    <Popular item = {"Electronic"} id={1}/>
    <Popular item = {"Office Supplies "} id={10}/>
    <Popular item = {"Office Supplies "} id={5}/>
     <Footer/>
    
    </div>

  )
}

export default Shop
