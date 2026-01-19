import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SoilForm from "./components/SoilComponent";
import Bot from "./components/Bot";
import MapComponent from "./components/Map";

function App() {
  return (
    <div style={{ backgroundColor: "#F1F8E9", minHeight: "100vh" }}>
      
      {/* Navigation */}
      <nav
        style={{
          padding: "1rem",
          background: "linear-gradient(90deg, #2E7D32, #4CAF50)",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "30px",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#FBC02D",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          Home
        </Link>

        <Link
          to="/map"
          style={{
            textDecoration: "none",
            color: "#FBC02D",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          Geo Map
        </Link>
      </nav>
      

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ maxWidth: "1100px", margin: "auto", padding: "0 20px" }}>
              <SoilForm />
              <div style={{ marginTop: "30px" }}>
                <Bot />
              </div>
            </div>
          }
        />

        <Route
          path="/map"
          element={
            <div
              style={{
                padding: "0 20px 30px",
                maxWidth: "1200px",
                margin: "auto"
              }}
            >
              <MapComponent />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
