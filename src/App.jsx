import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
// import Header from './components/Header';
// import Navbar from "./components/Navbar";
// import PrivateRoutes from "./components/PrivateRoute";
// import Topbar from "./components/Topbar";
// import Notifications from "./components/Notifications";
// import About from "./pages/About";
// import Home from "./pages/Home";
// import Shop from "./pages/Shop";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import PostPage from "./pages/PostPage";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./api/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const Navbar = lazy(() => import("./components/Navbar"));
  const PrivateRoutes = lazy(() => import("./components/PrivateRoute"));
  const Topbar = lazy(() => import("./components/Topbar"));
  const Notifications = lazy(() => import("./components/Notifications"));
  const About = lazy(() => import("./pages/About"));
  const Home = lazy(() => import("./pages/Home"));
  const Shop = lazy(() => import("./pages/Shop"));
  const Login = lazy(() => import("./pages/Login"));
  const Register = lazy(() => import("./pages/Register"));
  const Profile = lazy(() => import("./pages/Profile"));
  const Settings = lazy(() => import("./pages/Settings"));
  const PostPage = lazy(() => import("./pages/PostPage"));

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
      <Suspense fallback={<div>Loading...</div>}>
        <div className="App overflow-visible" id="App">
          {windowSize[0] < 762 ? (
            <Topbar pageWrapId="page-wrap" outerContainerId="App" />
          ) : (
            <Navbar />
          )}
          <ToastContainer />
          <div id="page-wrap">
            <Routes>
              <Route path="/" element={<PrivateRoutes />}>
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
      </Suspense>
    </AuthProvider>
  );
}

export default App;
