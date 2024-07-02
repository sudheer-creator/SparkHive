import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link , useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import { ShopContext } from "../../Context/ShopContext";
import { FaSearch } from "react-icons/fa";
import { Button, Dropdown, Space } from 'antd';

const items = [
  {
    key: '1',
    label: (
      <Link target="_self" rel="noopener noreferrer" to={"/user/accountsettings"}>
        Profile
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link target="_self" rel="noopener noreferrer" to={"/orders"}>
        Orders
      </Link>
    ),
  },
  {
    key: '3',
    label: (
      <Link target="_self" rel="noopener noreferrer" to={"Settings"}>
        Settings
      </Link>
    ),
  },
];

const Navbar = () => {
  const [menu, setMenu] = useState("shop")
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalCartItems } = useContext(ShopContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {

      const isLoggedInFromStorage = localStorage.getItem('isLoggedIn');
      const userNameFromStorage = localStorage.getItem('firstname');
      setIsLoggedIn(isLoggedInFromStorage);
      setFirstName(userNameFromStorage);
    };

    fetchUserData();
  }, []);
  const navigate = useNavigate();
  
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      // Trigger your search function here using the searchTerm state
console.log(searchTerm)
      // navigate(`/search/${searchTerm}`);
      window.location.replace(`/search/${searchTerm}`)
    }
  };
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('firstname');
    localStorage.removeItem('auth-token');
    window.location.replace("/");
  };

  return (
    <div className='bg-white '>
      <div className='py-4'>
        <div className="px-5  px-0 w-100 flex items-center justify-between"  >
          {/* Logo */}
          <div className='flex  items-center gap-4'>
            <img src={logo} style={{ width: "40px", borderRadius: "50%" }} alt="" />
            <a href="/"
              className='text-primary font-semibold traking-widest  text-2xl uppercase sm:text-3xl'>Spark Hive</a>
            {/* Menu items */}
            <div className='hidden lg:block'>
              <ul className='gap-4 items-center'>
                <li>
                  <Space >
                    <Dropdown
                      menu={{
                        items,
                      }}
                      placement="bottomLeft"
                      arrow={{
                        pointAtCenter: true,
                      }}
                    >
                      <Button>Account</Button>
                    </Dropdown>
                  </Space>

                </li>
                <li >
                  <Link to={"/"} className='inline-block px-4 font-semibold text-gray-700 hover:text-black duration-200'>Home</Link>
                </li>
                <li>
                  <Link to={"/search/a"} className='inline-block px-4 font-semibold text-gray-700 hover:text-black'>Categories</Link>
                </li>
                {/* <li>
                  <Link to={"/"} className='inline-block px-4 font-semibold text-gray-700 hover:text-black'>About</Link>
                </li> */}
                {
                  isLoggedIn?(

                    <div className='flex justify-center items-center'>
                      <li className='inline-block px-4 font-semibold text-gray-700 hover:text-black duration-200'>
                          Welcome {firstName}
                      </li>
                        <button className='rounded bg-red-500 px-4 py-2 text-white'  onClick={handleLogout}>Logout</button>
                    </div>
                     
             
                  ):(<div><li>
                    <Link to={"/login"} className='inline-block px-4 font-semibold text-gray-700 hover:text-black'>Login</Link>
                  </li></div>)
                }
                
              </ul>
            </div>
          </div>

          {/* navbar right section */}
          {/* <div className='flex justify-between items-center gap-4'> */}
          <div className='flex items-center gap-6'>
            <div className='relative ' >
              <Link to='/cart'><img src={cart_icon} style={{ height: "30px" }} alt="" /></Link>
              <div style={{width:"20px",height:"20px", display:"flex" , justifyContent:"center"}} className="font-semibold text-white rounded-lg bg-red-500 absolute top-0 -translate-y-3 -right-2">{getTotalCartItems()}</div>
            </div>
            <div className='relative group hidden sm:block'>
              {/* Search bar section */}
              <input type="text" placeholder='search' onKeyDown={handleKeyDown} onChange={handleChange} className='search-bar' />
              <FaSearch className='text-xl text-gray-600 absolute top-1/2 -translate-y-3 right-3' />
            </div>
          </div>


        </div>
      </div>
    </div>
    // <div className='navbar'>
    //   <Link style={{ textDecoration: 'none', color: '#626262' }} to='/'>
    //     <div className="nav-logo">
    //       <img src={logo} alt="" />
    //       <p>E-shop</p>
    //     </div>
    //   </Link>
    //   <ul className='nav-menu'>
    //     <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none', color: '#626262' }} to='/'>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
    //     <li onClick={() => { setMenu("search") }}><Link style={{ textDecoration: 'none', color: '#626262' }} to='/search'>search</Link>{menu === "search" ? <hr /> : <></>}</li>
    //   </ul>
    //   <div className="nav-login-cart">
    //     {isLoggedIn ? (
    //       <div className="welcome-logout">
    //         <p className="welcome-message">Welcome, {firstName}!</p>
    //         <button className="logout-button" onClick={handleLogout}>Logout</button>
    //       </div>
    //     ) : (
    //       <Link style={{ textDecoration: 'none' }} to="/login">
    //         <button style={{ cursor: 'pointer' }}>Login</button>
    //       </Link>
    //     )}


    //     <Link to='/cart'><img src={cart_icon} alt="" /></Link>
    //     <div className="nav-cart-count">{getTotalCartItems()}</div>
    //   </div>
    // </div>
  )
}

export default Navbar
