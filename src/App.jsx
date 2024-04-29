/* eslint-disable react/prop-types */
import React, { useState, useContext, createContext, useEffect, Suspense } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./Routes/NotFound/NotFound";

import Procedure from "./Routes/Procedure/Procedure";
import Footer from "./components/Footer";

// Lazy load your route components
const Home = React.lazy(() => import("./Routes/Home/Home"));
const Register = React.lazy(() => import("./Routes/Manage/Register/Register"));
const Login = React.lazy(() => import("./Routes/Manage/Login/Login"));
const Nav = React.lazy(() => import("./Routes/Navbar/Nav"));
const Create = React.lazy(() => import("./Routes/Create/Create"));
const Search = React.lazy(() => import("./Routes/Search/Search"));

export const UserContext = createContext();

function App({location}) {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(() => {
    // Retrieve company data from localStorage on initial render
    const storedCompany = localStorage.getItem("company");
    return storedCompany ? JSON.parse(storedCompany) : { gmail: "", password: "" };
  });
  const [status, setStatus] = useState("");
  const BASE = "http://localhost:8000";
  location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 2000);
  }, [status]);

  useEffect(() => {
    // Save company data to localStorage whenever it changes
    localStorage.setItem("company", JSON.stringify(company));
  }, [company]);

  const theStates = {
    loading,
    setLoading,
    company,
    setCompany,
    BASE,
    status,
    setStatus,
  };



  // If you want to clear company data on certain routes, you can do it here
  useEffect(() => {
    if (location.pathname === "/logout") {
      setCompany({ gmail: "", password: "" });
    }
  }, [location.pathname, setCompany]);

  return (
    <section className="bg-black flex flex-col justify-center items-center">
      
        <UserContext.Provider value={theStates}>
         
          <Suspense fallback={<div>Loading...</div>}>
            <Nav />
            {/* <Search /> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/procedure" element={<Procedure/>}></Route>
              {company.gmail && (
                <Route path="/create" element={<Create />}></Route>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
          </Suspense>
          
        </UserContext.Provider>
     <Footer/>
    </section>
  );
}

export default App;
