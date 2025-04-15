// src/components/House.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const House = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null); // ✅ NEW: Save the Leaflet map instance
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }

    const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);
    leafletMap.current = map; // ✅ Save the instance

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: '',
      html: '📍',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 13);

        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup('📍 You are here')
          .openPopup();

        try {
          const res = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=20&key=4f5bc103-bb45-47c1-8c5a-d4301b503a79`
          );
          const data = await res.json();
          setStations(data);

          data.forEach((station) => {
            const coords = station.AddressInfo;
            if (coords?.Latitude && coords?.Longitude) {
              L.marker([coords.Latitude, coords.Longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<strong>${coords.Title}</strong><br/>${coords.AddressLine1}`);
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
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
        📍 Nearby EV Charging Stations
      </h3>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full rounded-xl shadow-md border"
        style={{ height: '400px' }}
      ></div>

      {/* Station Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stations.map((station) => {
          const info = station.AddressInfo;
          const title = info?.Title || 'Unnamed Station';
          const address = info?.AddressLine1 || 'No address';
          const town = info?.Town || '';
          const state = info?.State || '';
          const distance = info?.Distance;
          const connectionType = station.Connections?.[0]?.ConnectionType?.Title || '';

          return (
            <div
              key={station.ID}
              className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition"
            >
              <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-1">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {address}, {town}, {state}
              </p>
              {connectionType && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  🔌 {connectionType}
                </p>
              )}
              {distance && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  📏 {distance.toFixed(2)} miles away
                </p>
              )}
              <button
                onClick={() => {
                  if (leafletMap.current && info?.Latitude && info?.Longitude) {
                    leafletMap.current.setView([info.Latitude, info.Longitude], 15);
                    L.popup()
                      .setLatLng([info.Latitude, info.Longitude])
                      .setContent(`<strong>${title}</strong><br/>${address}`)
                      .openOn(leafletMap.current);
                  }
                }}
                className="mt-3 inline-block px-4 py-1 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                View on Map
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default House;
