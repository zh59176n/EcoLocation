import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const House = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.log('📍 Leaflet map useEffect running');

    // 🧼 Clean up any existing Leaflet instance to prevent duplicate init
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }

    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);

          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('You are here')
            .openPopup();
        },
        () => {
          L.marker([40.7128, -74.006])
            .addTo(map)
            .bindPopup('Default location: NYC')
            .openPopup();
        }
      );
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl shadow-md border"
      style={{ height: '500px' }}
    ></div>
  );
};

export default House;
