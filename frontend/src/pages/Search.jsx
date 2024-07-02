

// import React, { useState, useEffect } from "react";
// import "./CSS/ProductCard.css";

// function Search() {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(1000);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const [searchClicked, setSearchClicked] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch("http://localhost:3001/api/products");
//       const data = await response.json();
//       setProducts(data);
//     };

//     fetchData();
//   }, []);

//   // const handleSearchChange = (event) => {
//   //   setCheckPrice(false);
//   //   setSearchTerm(event.target.value);
//   //   // setSearchClicked(false);
//   // };

//   const handleMinPriceChange = (event) => {

//     setMinPrice(event.target.value);
//   };

//   const handleMaxPriceChange = (event) => {

//     setMaxPrice(event.target.value);
//   };

//   const handleCategoryChange = (event) => {

//     setSelectedCategory(event.target.value);
//   };

//   const handleSearchClick = () => {

//     setSearchTerm(document.getElementById("searchInput").value);
//   };

//   const filteredProducts = products.filter((product) => {
//     // const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const nameMatch = product.name.toLowerCase()===(searchTerm.toLowerCase());

//      const priceMatch =Number(product.price) >= Number(minPrice) && Number(product.price) <= Number(maxPrice);
//     const categoryMatch =
//       !selectedCategory || product.category === selectedCategory;


//     return nameMatch && priceMatch && categoryMatch && searchTerm!=="" ;
//   });
//  // value={searchTerm}
//         // onChange={handleSearchChange}
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search products..."
//         className="search"
//         id="searchInput"
//       />
//       <button className="search_button" onClick={handleSearchClick} >Search</button>
//       <br />
//       <br />
//       {searchClicked?<>
//       <label htmlFor="minPrice">Minimum Price:</label>
//       <input
//         type="number"
//         id="minPrice"
//         value={minPrice}
//         onChange={handleMinPriceChange}
//       />
//       <br />
//       <label htmlFor="maxPrice">Maximum Price:</label>
//       <input
//         type="number"
//         id="maxPrice"
//         value={maxPrice}
//         onChange={handleMaxPriceChange}
//       />
//       <br />
//       <br />
//       <label htmlFor="category">Category:</label>
//       <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
//         <option value="">All</option>
//         {/* Replace with your actual category options */}
//         <option value="Electronics">Electronics</option>
//         <option value="Audio">Audio</option>
//         <option value="Appliances">Appliances</option>
//       </select>

//       </>:<></>}
//       <br />
//       <br />

//       <br />
//       <br />
//       {searchClicked?<h2>Products</h2>:<></>}
//       {searchClicked && filteredProducts.length > 0 ? (
//         <ul className="product_ul">
//           {filteredProducts.map((product) => (
//             <li key={product.id} className="product-card">
//               <img src={product.image_url} alt={product.name} />
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <p className="price">${product.price}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         searchClicked && <p>No products found.</p>
//       )}
//     </div>
//   );
// }

// export default Search;


import React, { useState, useEffect} from "react";
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import "./CSS/ProductCard.css";
import { Link } from 'react-router-dom'


function Search() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
const {value} = useParams();
  const [searchTerm, setSearchTerm] = useState(value);
  const [minPrice, setMinPrice] = useState(0); // Initial minimum price
  const [maxPrice, setMaxPrice] = useState(1000); // Initial maximum price
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchClicked, setSearchClicked] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/catproducts");
      const data = await response.json();
      console.log(data)
      setProducts(data);
    };
    const fetchCatData = async () => {
      const response = await fetch("http://localhost:3001/api/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchData();
    fetchCatData();
    uniqueProductIds.clear();
  }, []);
  

  // const handleSearchClick = () => {
  //   const term =document.getElementById("searchInput").value;
  //   //  setSearchTerm(term);
  //   setSearchClicked(true);
  //   // setMinPrice(10);
  //   // Update minPrice and maxPrice based on filtered products (if searchTerm is not empty)
  //   if (true) {
  //     const filteredProducts=products.filter((product) => {
  //       const nameMatch = product.name.toLowerCase().includes(term.toLowerCase());
  //       return nameMatch;
  //     });
  //       const filteredProductPrices = filteredProducts.map((product) => product.price);
  //     setMinPrice(Math.min(...filteredProductPrices)); // Minimum price from filtered products
  //     setMaxPrice(Math.max(...filteredProductPrices)); // Maximum price from filtered products
  //   }
    
  // };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);

  };
const uniqueProductIds = new Set();

  const filteredProducts = products.filter((product) => {
    
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch =
      Number(product.price) >= Number(minPrice) && Number(product.price) <= Number(maxPrice);
      console.log(selectedCategory)
    const categoryMatch = !selectedCategory || (Number(product.category_id) == Number(selectedCategory));
    console.log(categoryMatch)
    console.log(uniqueProductIds)
      if (nameMatch && priceMatch && categoryMatch ) {
        if(!uniqueProductIds.has(product.product_id))
        {uniqueProductIds.add(product.product_id); // Add ID if unique
        return ( nameMatch && priceMatch && categoryMatch );}
      } else {
        return false; // Reject duplicate product
      }
  });

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Search products..."
        className="search"
        id="searchInput"
      />
      <button className="search_button" onClick={handleSearchClick} style={{ cursor: 'pointer' }}>
   Search
     </button> */}
      <br />
      <br />
      <div className="search_box">

      
      {searchClicked ? (
        <div className="mx-5" >
          <label htmlFor="minPrice">Minimum Price:</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
          <br />
          <label htmlFor="maxPrice">Maximum Price:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
          <br />
          <br />
          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All</option>
           
            
             {categories.length > 0 ?(

            categories.map((item)=>{
              return <option value={item.category_id}>{item.category_name}</option>
            })
            
            ):<></>
            }

          </select>
        </div>
      ) : (
        <></>
      )}
      <br />
      <br />
        <div className="product_list">
      {/* {searchClicked ? <h2>Products</h2> : <></>} */}
      {searchClicked && filteredProducts.length > 0 ? (
        
        <ul className="product_ul">
          {filteredProducts.map((product) => (
            
            <li key={product.product_id} className="product-card">
        
              <Link style= {{textDecoration:'none' ,color:'#626262'}} to ={`/product/${product.product_id}`}>
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              </Link>
            </li>
            
          ))}
        </ul>
        
      ) : (
        searchClicked && <p>No products found.</p>
      )}</div>
      </div>
    </div>
  );
}

export default Search;
