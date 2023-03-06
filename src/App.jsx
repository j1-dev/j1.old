import React, { useState, useEffect } from "react";
import "./App.css";
//import Header from './components/Header';
import Navbar from "./components/Navbar";
import PrivateRoutes from "./components/PrivateRoute";
import Topbar from "./components/Topbar";
import Notifications from "./components/Notifications";
import About from "./pages/About";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PostPage from "./pages/PostPage";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./api/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = (e) => {
      e.preventDefault();
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    const handleWindowLoad = (e) => {
      e.preventDefault();
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("DOMContentLoaded", handleWindowLoad);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("DOMContentLoaded", handleWindowLoad);
    };
  }, [windowSize, setWindowSize]);

  return (
    <AuthProvider>
      <div className="App overflow-visible" id="App">
        {windowSize[0] < 762 ? (
          <Topbar pageWrapId="page-wrap" outerContainerId="App" />
        ) : (
          <div>
            <Navbar />
          </div>
        )}
        <ToastContainer />
        <div id="page-wrap">
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/About" element={<About />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/:username" element={<Profile />} />
              <Route exact path="/Post" element={<PostPage />} />
              <Route exact path="/Post/:id" element={<PostPage />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
