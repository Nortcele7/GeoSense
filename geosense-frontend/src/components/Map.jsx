import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon missing in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchGeoData(e.latlng.lat, e.latlng.lng);
      fetchPlaceName(e.latlng.lat, e.latlng.lng);
    },
    mousemove(e) {
       // Optional: Update a separate 'cursor position' state if needed, 
       // but for 'hover on any point' displaying lat/lng, a simple tooltip tool is better
       // or we can just render the lat/lng in a fixed overlay.
       window.dispatchEvent(new CustomEvent('map-hover', { detail: e.latlng }));
    }
  });

  const fetchPlaceName = async (lat, lng) => {
      try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          setPlaceName(res.data.display_name || "Unknown Location");
      } catch (err) {
          console.error("Geocoding error", err);
          setPlaceName("Location lookup failed");
      }
  }

  const fetchGeoData = async (lat, lng) => {
    setLoading(true);
    setGeoData(null); // Reset previous data
    try {
      // Adjust URL to your backend port
      const response = await axios.post('http://localhost:8000/get_geo_data', {
        latitude: lat,
        longitude: lng
      });
      setGeoData(response.data);
    } catch (error) {
      console.error("Error fetching geo data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
      if (geoData) {
          navigate('/', { state: { soil_type: geoData.soil_type } });
      }
  };

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div style={{ minWidth: '200px' }}>
          <h3>Location Details</h3>
          <p style={{fontSize: '0.9em', color: '#555'}}>{placeName}</p>
          <p><strong>Lat:</strong> {position.lat.toFixed(4)}, <strong>Lng:</strong> {position.lng.toFixed(4)}</p>
          
          {loading && <p>Loading soil data...</p>}
          
          {!loading && geoData && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
              <p><strong>Soil Type:</strong> {geoData.soil_type}</p>
              <button 
                onClick={handleNavigate}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '5px',
                    width: '100%'
                }}
              >
                Use this Soil Type
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Component to display hover coordinates
const HoverInfo = () => {
    const [coords, setCoords] = useState(null);

    React.useEffect(() => {
        const handler = (e) => setCoords(e.detail);
        window.addEventListener('map-hover', handler);
        return () => window.removeEventListener('map-hover', handler);
    }, []);

    if (!coords) return <div style={{position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: 'rgba(255,255,255,0.8)', padding: '5px'}}>Hover over map</div>;

    return (
        <div style={{
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            zIndex: 1000, 
            background: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            fontSize: '0.9rem'
        }}>
            Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
        </div>
    );
}

const MapComponent = () => {
    // Kathmandu Center
  const position = [27.7172, 85.3240]; 
  
  // Kathmandu Valley Bounds
  const bounds = [
    [27.55, 85.15], // Southwest
    [27.85, 85.60]  // Northeast
  ];

  return (
    <div style={{ height: '500px', width: '100%', border: '2px solid #ddd', borderRadius: '8px', position: 'relative' }}>
      <HoverInfo />
      <MapContainer 
        center={position} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        maxBounds={bounds}
        minZoom={11}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
