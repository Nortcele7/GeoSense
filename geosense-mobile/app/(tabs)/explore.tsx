import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  WebView,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface MarkerPosition {
  latitude: number;
  longitude: number;
}

interface GeoData {
  soil_type: string;
}

export default function ExploreScreen() {
   const insets = useSafeAreaInsets();
  const router = useRouter();
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverCoords, setHoverCoords] = useState<MarkerPosition | null>({
    latitude: 27.7172,
    longitude: 85.3240,
  });

  // Kathmandu center
  const initialLatitude = 27.7172;
  const initialLongitude = 85.3240;

  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      setPlaceName(res.data.display_name || 'Unknown Location');
    } catch (err) {
      console.error('Geocoding error', err);
      setPlaceName('Location lookup failed');
    }
  };

  const fetchGeoData = async (lat: number, lng: number) => {
    setLoading(true);
    setGeoData(null);
    try {
      const response = await axios.post(
        'https://patronising-postcentral-pamella.ngrok-free.dev/get_geo_data',
        {
          latitude: lat,
          longitude: lng,
        }
      );
      setGeoData(response.data);
    } catch (error) {
      console.error('Error fetching geo data', error);
      Alert.alert('Error', 'Failed to fetch soil data');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    fetchGeoData(latitude, longitude);
    fetchPlaceName(latitude, longitude);
  };

  const handleUseSoilType = () => {
    if (geoData) {
      router.push({
        pathname: '/(tabs)',
        params: { soil_type: geoData.soil_type }
      });
      Alert.alert('Success', `Soil type "${geoData.soil_type}" applied to form`);
    }
  };

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapClick') {
        const { lat, lng } = data;
        setMarkerPosition({ latitude: lat, longitude: lng });
        fetchGeoData(lat, lng);
        fetchPlaceName(lat, lng);
      } else if (data.type === 'mapMove') {
        setHoverCoords({
          latitude: data.lat,
          longitude: data.lng,
        });
      }
    } catch (err) {
      console.error('Error parsing map message', err);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        * { margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; }
        .leaflet-container { background: #e0e0e0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([27.7172, 85.3240], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        let marker = null;

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (marker) {
            map.removeLayer(marker);
          }
          marker = L.marker([lat, lng]).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            lat: lat,
            lng: lng
          }));
        });

        map.on('move', () => {
          const center = map.getCenter();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapMove',
            lat: center.lat,
            lng: center.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom }
    ]}>
      <WebView
        style={styles.map}
        source={{ html: mapHtml }}
        onMessage={handleMapMessage}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        scalesPageToFit={true}
      />

      {/* Hover Coordinates Display */}
      <View style={styles.hoverInfo}>
        {hoverCoords ? (
          <Text style={styles.hoverText}>
            Lat: {hoverCoords.latitude.toFixed(4)}, Lng: {hoverCoords.longitude.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.hoverText}>Tap on map to select location</Text>
        )}
      </View>

      {/* Location Details Panel */}
      {markerPosition && (
        <View style={styles.detailsPanel}>
          <Text style={styles.detailsTitle}>Location Details</Text>
          
          {placeName && (
            <Text style={styles.placeName}>{placeName}</Text>
          )}
          
          <Text style={styles.coordinates}>
            Lat: {markerPosition.latitude.toFixed(4)}, Lng: {markerPosition.longitude.toFixed(4)}
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading soil data...</Text>
            </View>
          )}

          {!loading && geoData && (
            <View style={styles.soilDataContainer}>
              <View style={styles.soilTypeRow}>
                <Text style={styles.soilTypeLabel}>Soil Type:</Text>
                <Text style={styles.soilTypeValue}>{geoData.soil_type}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.useSoilButton}
                onPress={handleUseSoilType}
              >
                <Text style={styles.useSoilButtonText}>Use this Soil Type</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  hoverInfo: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  hoverText: {
    fontSize: 13,
    color: '#33691E',
    fontWeight: '500',
  },
  detailsPanel: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#33691E',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#33691E',
    fontWeight: '500',
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#689F38',
  },
  soilDataContainer: {
    borderTopWidth: 1,
    borderTopColor: '#DCEDC8',
    paddingTop: 12,
    marginTop: 8,
  },
  soilTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  soilTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#33691E',
  },
  soilTypeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  useSoilButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  useSoilButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});