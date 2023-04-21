import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";

import MainLayout from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDashboard from "./pages/customerDashboard";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Protected from "./Protected";
import axios from 'axios';
import RoleProtected from "./RoleProtected";
import AddFood from "./pages/AddFood";
import Home from "./pages/Home";
import { Context } from "./Context";
import Navbar from './Navbar';

function App() {

  const [status, setStatus] = useState(false);
  const token = localStorage.getItem('rfkey');

  const checkLogin = async () => {
    const user = {
      refreshToken: token,
    };


    const { data: response } = await axios.post('http://localhost:8080/api/refreshToken', user)
    console.log(response.error);
    if (response.error === false) {
      setStatus(true);
      console.log("setted true");
    }
    else {
      setStatus(false);
      console.log("setted false");
    }
  }

  useEffect(() => {
    checkLogin();
  }, []);

  const [isSeller, setIsSeller] = useState(false);

  const fetchRole = async () => {
    if (status == true) {
      try {
        const { data: response } = await axios.get(`http://localhost:8080/api/users/getId/${localStorage.getItem("username")}`);
        setIsSeller(response.isSeller);
        console.log(response);

      } catch (error) {
        console.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchRole();
  }, []);


  const logOut = async () => {


    await fetch("http://localhost:8080/api/refreshToken", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("rfkey"),
      })
    }).then((res) => {
      if (res.ok) {
        localStorage.setItem("rfkey", "");
        console.log("logged out successfully");
        window.location.reload(false);
        setStatus(false);
        console.log(status);
      }
      else {
        console.log("Cannot logout");

      }

    })
    localStorage.removeItem("isLogged");
  };

  return (
    <Context.Provider>
      <BrowserRouter>
        <div>
          <Navbar isSeller={isSeller} setStatus={setStatus} status={status} logOut={logOut} />
          <Routes>

            <Route path='/' element={<Home />} />




            <Route path='/cart/:id'
              element={
                <Protected isLoggedIn={status}>
                  <Dashboard />
                </Protected>
              }

            />

            <Route path='/add-food'
              element={
                <RoleProtected isSeller={isSeller}>
                  <AddFood />
                </RoleProtected>
              }
            />

            <Route path='/my-account'
              element={
                <Protected isLoggedIn={status}>
                  <MyAccount isSeller={isSeller} />
                </Protected>
              }
            />

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

          </Routes>
        </div>

      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
