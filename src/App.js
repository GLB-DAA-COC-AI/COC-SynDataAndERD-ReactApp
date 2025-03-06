import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function App() {
  // Create a ref for the functionalities section
  const functionalitiesRef = useRef(null);

  // Define a callback that scrolls to the functionalities section
  const handleGetStartedClick = () => {
    if (functionalitiesRef.current) {
      functionalitiesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Router>
      <Navbar />
      {/* Pass the scroll callback to HeroSection */}
      <HeroSection onGetStartedClick={handleGetStartedClick} />
      <Routes>
        <Route
          path="/"
          element={
            // Wrap Home with a div that has the ref attached
            <div ref={functionalitiesRef}>
              <Home />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
