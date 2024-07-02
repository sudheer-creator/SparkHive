import React, { useContext } from 'react'
import Breadcrums from '../Components/Breadcrums/Breadcrums'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox'
// import RelatedProducts from '../Components/RelatedProducts/RelatedProducts'
import { useParams } from 'react-router-dom'
import { useState , useEffect } from 'react'
// import { ShopContext } from '../Context/ShopContext'

const Product = () => {
  const [products, setProducts] = useState([]);
  const {productId} = useParams();

  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      setProducts(data);
    };
    console.log(products)
    fetchData();
  }, []);
 
 
  const filteredProducts=products.filter((product) => product.product_id==productId);
  
//  product=products[0];
//  console.log(products);
  // const {products} = useContext(ShopContext);
  
  // const product = products.find((e)=>e.id === Number(productId));
  
  return (
    <div>
     {filteredProducts.length > 0 && <Breadcrums product={filteredProducts}/>}
      {filteredProducts.length > 0 && <ProductDisplay product={filteredProducts[0]} />}
      <DescriptionBox productId={productId} />
      {/* <RelatedProducts/> */}
    </div>
  )
}

export default Product
