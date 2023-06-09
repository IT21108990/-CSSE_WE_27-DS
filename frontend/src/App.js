import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";

import MainLayout from "./components/Admin-MainLayout";
import { Dashboard } from "./pages/Dashboard";
import Customers from "./pages/Customers-Admin";
import Sellers from "./pages/Sellers-Admin"
import Orders from "./pages/Orders-Admin"
import Settings from "./pages/Settings-Admin"
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Protected from "./Protected";
import axios from "axios";
import RoleProtected from "./RoleProtected";
import AddFood from "./pages/AddFood";
import Home from "./pages/home.jsx";
import { Context } from "./Context";
import Navbar from "./Navbar";
import SingleFood from "./pages/SingleFood";
import Swal from "sweetalert2";
import Cart from "./pages/Cart";
import UpdateFood from "./pages/UpdateProduct";
import Payment from "./pages/Payment";

import Catagory1 from "./pages/Catagories/HerbalBeautyProducts";
import Catagory2 from "./pages/Catagories/HerbalHairProducts";
import Catagory3 from "./pages/Catagories/Other";

import Sellerdash from "./pages/SellerDashboard";
import EditProducts from "./components/SellerProduct/EditProducts";

function App() {
  const [status, setStatus] = useState(false);
  const token = localStorage.getItem("rfkey");
  const [cartFoodLoading, setCartFoodLoading] = useState(true);
  const [cartFoodData, setCartFoodData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [data, setData] = useState([]);
  const [cartCount, setCartCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState("");
  const [orderData, setOrderData] = useState([]);

  const [isSeller, setIsSeller] = useState();
  const [isCustomer, setIsCustomer] = useState(true);

  const deleteItem = async (id) => {
    await Swal.fire({
      title: "Do you want to remove this from?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Remove",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Removed Item!", "", "success");
        const data = fetch(`http://localhost:9010/api/cart/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        setCartFoodData((cartFoodData) =>
          cartFoodData.filter((cartFoodItem) => cartFoodItem._id !== data._id)
        );
      } else if (result.isDenied) {
        Swal.fire("Item is not removed", "", "info");
      }
    });
    getCartTotal();
    fetchCartFoodData();
  };

  const getCartTotal = async () => {
    try {
      const { data: response } = await axios.get(
        `http://localhost:9010/api/cart/user/getTotal/${localStorage.getItem(
          "username"
        )}`
      );
      setCartTotal(response);
      console.log("Cart Total is" + response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCartTotal();
  }, []);

  const checkLogin = async () => {
    const user = {
      refreshToken: token,
    };

    const { data: response } = await axios.post(
      "http://localhost:8080/api/refreshToken",
      user
    );
    console.log(response.error);
    if (response.error === false) {
      setStatus(true);
      console.log("setted true");
    } else {
      setStatus(false);
      console.log("setted false");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const fetchCartFoodData = async () => {
    setCartFoodLoading(true);
    getCartTotal();
    try {
      const { data: response } = await axios.get(
        `http://localhost:9010/api/cart/${localStorage.getItem("username")}`
      );
      setCartFoodData(response);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
    setCartFoodLoading(false);
  };

  useEffect(() => {
    fetchCartFoodData();
  }, []);

  useEffect(() => {
    fetchCartFoodData();
  }, [setCartFoodData]);

  const fetchCartCount = async () => {
    try {
      const { data: response } = await axios.get(
        `http://localhost:9010/api/cart/users/${localStorage.getItem(
          "username"
        )}`
      );
      setCartCount(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [cartFoodData]);

  const fetchRole = async () => {
    if (status == true) {
      try {
        const { data: response } = await axios.get(
          `http://localhost:8080/api/users/getId/${localStorage.getItem(
            "username"
          )}`
        );
        setIsSeller(response.isSeller);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const logOut = async () => {
    await fetch("http://localhost:8080/api/refreshToken", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("rfkey"),
      }),
    }).then((res) => {
      if (res.ok) {
        localStorage.setItem("rfkey", "");
        console.log("logged out successfully");
        window.location.reload(false);
        setStatus(false);
        console.log(status);
      } else {
        console.log("Cannot logout");
      }
    });
    localStorage.removeItem("isLogged");
  };

  return (
    <Context.Provider>
      <BrowserRouter>
        <div>
          <Navbar
            fetchCartCount={fetchCartCount}
            cartCount={cartCount}
            setCartCount={setCartCount}
            isSeller={isSeller}
            setStatus={setStatus}
            status={status}
            logOut={logOut}
          />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/cart/:id"
              element={
                //<Protected isLoggedIn={status}>
                <Cart
                  cartCount={cartCount}
                  setCartCount={setCartCount}
                  fetchCartCount={fetchCartCount}
                  deleteItem={deleteItem}
                  fetchCartFoodData={fetchCartFoodData}
                  cartFoodLoading={cartFoodLoading}
                  cartFoodData={cartFoodData}
                  getCartTotal={getCartTotal}
                  cartTotal={cartTotal}
                  orderData={orderData}
                  setOrderData={setOrderData}
                />
                //</Protected>
              }
            />

            {/* <Route path="/add-food" element={<AddFood />} /> */}

            <Route
              path="/payment"
              element={
<<<<<<< Updated upstream
                <Payment
                  setCartTotal={setCartTotal}
                  cartTotal={cartTotal}
                  cartFoodData={cartFoodData}
                />
=======
                <Payment setCartTotal={setCartTotal} cartTotal={cartTotal} cartFoodData={cartFoodData} fetchCartFoodData={fetchCartFoodData}/>
>>>>>>> Stashed changes
              }
            />

            {/* Categories */}

            <Route path="/herbal-beauty" element={<Catagory1 />} />
            <Route path="/herbal-hair" element={<Catagory2 />} />
            <Route path="/other" element={<Catagory3 />} />

            <Route
              path="/product/:id"
              element={
                <SingleFood
                  getCartTotal={getCartTotal}
                  cartTotal={cartTotal}
                  fetchCartFoodData={fetchCartFoodData}
                  fetchCartCount={fetchCartCount}
                  setLoading={setLoading}
                  setData={setData}
                  data={data}
                />
              }
            />

            {/* <Route path="/add-food" element={<AddFood />} /> */}

            <Route
              path="/my-account"
              element={
                <Protected isLoggedIn={status}>
                  <MyAccount isCustomer={isCustomer} />
                </Protected>
              }
            />

            <Route
              path="/seller-profile"
              element={<Sellerdash isCustomer={isSeller} />}
            />

            <Route path="/edit-product" element={<EditProducts />} />

            <Route
              path="/update/:id"
              element={
                <UpdateFood
                  fetchCartFoodData={fetchCartFoodData}
                  getCartTotal={getCartTotal}
                />
              }
            />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vendors" element={<Sellers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
