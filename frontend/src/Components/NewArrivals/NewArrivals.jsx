import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
// import SampleNextArrow from "./SampleNextArrow";
// import SamplePrevArrow from "./SamplePrevArrow";
import { useEffect ,useState } from "react";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black" }}
        onClick={onClick}
      />
    );
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black" }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchData();
  }, []);
  return (
    <div className=" pb-16 px-20" >
      <Heading heading="New Arrivals" />
      {products.length > 0 && (

       
      <Slider {...settings}>
      
        <div className="px-2">
          {
            products.map((product)=>(
              <Product
            _id={product.product_id}
            img={product.image_url}
            productName={product.name}
            price={product.price}
            color="Black"
            badge={true}
            des={product.description}
          />
            ))
          }
        </div>
      </Slider>
    
      // <div className="px-2 flex flex-col  sm:flex-row">
      //      {
      //       products.map((product)=>(
      //         <Product
      //       _id={product.product_id}
      //       img={product.image_url}
      //       productName={product.name}
      //       price={product.price}
      //       color="Black"
      //       badge={true}
      //       des={product.description}
      //     />
      //       ))
      //     }
      //   </div>
    
    )}
      {/* <Slider {...settings}>
        <div className="px-2">
          <Product
            _id="100001"
            img={"http://localhost:3001/images/laptop.webp"}
            productName="Round Table Clock"
            price="44.00"
            color="Black"
            badge={true}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100002"
            img={"http://localhost:3001/images/laptop.webp"}
            productName="Smart Watch"
            price="250.00"
            color="Black"
            badge={true}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100003"
            img={"http://localhost:3001/images/laptop.webp"}
            productName="cloth Basket"
            price="80.00"
            color="Mixed"
            badge={true}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100004"
            img={"http://localhost:3001/images/laptop.webp"}
            productName="Funny toys for babies"
            price="60.00"
            color="Mixed"
            badge={false}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100005"
            img={"http://localhost:3001/images/laptop.webp"}
            productName="Funny toys for babies"
            price="60.00"
            color="Mixed"
            badge={false}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
      </Slider> */}
    
    </div>
  );
};

export default NewArrivals;

