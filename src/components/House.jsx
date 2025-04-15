// src/components/House.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const House = () => {
  const mapRef = useRef(null);

  // Custom EV Charger Icon
  const evIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }

    const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 13);

        // Add user marker
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup('📍 You are here')
          .openPopup();

        try {
          const res = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=20&key=4f5bc103-bb45-47c1-8c5a-d4301b503a79`
          );
          const data = await res.json();

          data.forEach((station) => {
            const coords = station.AddressInfo;
            if (coords?.Latitude && coords?.Longitude) {
              const name = coords.Title || 'Unnamed Station';
              const address = coords.AddressLine1 || 'No address';
              L.marker([coords.Latitude, coords.Longitude], { icon: evIcon })
                .addTo(map)
                .bindPopup(
                  `<div style="font-size: 14px; line-height: 1.4;">
                     <strong>${name}</strong><br/>
                     <span>${address}</span>
                   </div>`
                );
            }
          });
        } catch (err) {
          console.error('⚠️ Failed to load EV station data:', err);
        }
      },
      () => {
        L.marker([40.7128, -74.006])
          .addTo(map)
          .bindPopup('📍 Default location: NYC')
          .openPopup();
      }
    );
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">
        🔌 Nearby EV Charging Stations
      </h2>
      <div
        ref={mapRef}
        className="w-full rounded-xl shadow-md border border-green-400 dark:border-green-600"
        style={{ height: '500px' }}
      ></div>
    </div>
  );
};

export default House;
