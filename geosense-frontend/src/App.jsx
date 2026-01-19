import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SoilForm from "./components/SoilComponent";
import Bot from "./components/Bot";
import MapComponent from "./components/Map";


function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Home</Link>
        <Link to="/map" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Geo Map</Link>
      </nav>

      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>GeoSense Explorer</h1>

      <Routes>
        <Route path="/" element={
          <div>
            <SoilForm />
            <Bot />
          </div>
        } />
        <Route path="/map" element={
          <div style={{ padding: '0 20px', marginBottom: '20px' }}>
            <MapComponent />
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
