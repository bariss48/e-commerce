import React,{useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import {loadUser} from './actions/userActions'
import store from './store'
import Profile from './components/user/Profile'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import axios from 'axios'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {
  
  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
     store.dispatch(loadUser())
     async function getStripeApiKey() {
       const {data} = await axios.get('/api/v1/stripeapi');
       setStripeApiKey(data.stripeApiKey)
     }
     getStripeApiKey();
  },[])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} /> 
            {stripeApiKey &&      
            <Route path="/payment" 
            element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payment/>
            </Elements>
            } 
            />
          }
            <Route path="/cart" element={<Cart/>} />
            <Route path="/product/:id" element={<ProductDetails />} exact/>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/password/forgot" element={<ForgotPassword/>} />
            <Route path="/password/reset/:token" element={<NewPassword/>} />
            <Route path="/me" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
            <Route path="/me/update" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}></Route>
            <Route path="/password/update" element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}></Route>
            <Route path="/shipping" element={<ProtectedRoute><Shipping/></ProtectedRoute>}></Route>
            <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}></Route>
            <Route path="/success" element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}></Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
