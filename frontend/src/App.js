
import './App.css';
import { BrowserRouter , Route, Routes , } from "react-router-dom";


import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product'
import Shop from './pages/Shop';
import Navbar from './Components/Navbar/Navbar';
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'
import Account  from './pages/Account'
import Search from './pages/Search'
import Order from './Components/Order/Order';
import Itemorder from './Components/Itemorder/Itemorder';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './Components/Orders2/Orders';
import UserProfile from './pages/User/UserProfile';

function App() {
  return (
    <div >
     
        <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/account' element={<Account/>}/>
            <Route path='/orders/:productId' element={<Order />} />

          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>

          <Route path='/itemorder' element={<Itemorder/>}>
            <Route path=':itemid' element={<Itemorder/>}/>
          </Route>

          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path='/search' element={<Search/>}>
            <Route path=':value' element={<Search/>}/>
          </Route>
          <Route path="/user/:activepage" element={<UserProfile/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<Order />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/login' element={<LoginSignup/>}/>
        </Routes>
        </BrowserRouter>
    </div>
  );
} 

export default App;
