import React, { useState, useEffect } from "react";
import "./App.css";
//import Header from './components/Header';
import Navbar from "./components/Navbar";
import MenuS from "./components/MenuS";
import PrivateRoutes from "./components/PrivateRoute";
import Topbar from "./components/Topbar";
import About from "./pages/About";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import Ajustes from "./pages/Ajustes";
import PostPage from "./pages/PostPage";
import { Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./api/authContext";
import { auth } from "./api/firebase-config";
import Notifications from "./components/Notifications";

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
          <div className="sticky top-0 z-50 bg-white shadow-md shadow-purple-100 transition-all">
            <MenuS pageWrapId="page-wrap" outerContainerId="App" />
            <Topbar />
          </div>
        ) : (
          <div>
            <Navbar />
          </div>
        )}

        <div id="page-wrap">
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/Perfil" element={<Perfil />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/About" element={<About />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/:username" element={<Perfil />} />
              <Route exact path="/Post" element={<PostPage />} />
              <Route exact path="/Post/:id" element={<PostPage />} />
              <Route path="/Ajustes" element={<Ajustes />} />
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
