// src/components/House.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './House.css';

const House = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [stations, setStations] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }

    leafletMap.current = L.map(mapRef.current).setView([40.7128, -74.006], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMap.current);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        leafletMap.current.setView([latitude, longitude], 13);

        L.marker([latitude, longitude], {
          icon: L.divIcon({ html: '📍', className: 'emoji-pin' })
        }).addTo(leafletMap.current).bindPopup('📍 You are here').openPopup();

        try {
          const res = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=20&key=4f5bc103-bb45-47c1-8c5a-d4301b503a79`
          );
          const data = await res.json();

          data.forEach((station) => {
            const coords = station.AddressInfo;
            if (coords?.Latitude && coords?.Longitude) {
              const marker = L.marker([coords.Latitude, coords.Longitude], {
                icon: L.divIcon({ html: '📍', className: 'emoji-pin' })
              }).addTo(leafletMap.current);

              marker.bindPopup(`<strong>${coords.Title}</strong><br/>${coords.AddressLine1}`);
              station.__marker = marker;
              station.__coords = [coords.Latitude, coords.Longitude];
            }
          });

          setStations(data);
        } catch (err) {
          console.error('⚠️ Error fetching EV stations:', err);
        }
      },
      () => {
        L.marker([40.7128, -74.006])
          .addTo(leafletMap.current)
          .bindPopup('📍 Default location: NYC')
          .openPopup();
      }
    );
  }, []);

  const scrollToMarker = (station) => {
    if (leafletMap.current && station.__coords && station.__marker) {
      leafletMap.current.setView(station.__coords, 15);
      station.__marker.openPopup();
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-2">
        🔌 Nearby EV Charging Stations
      </h2>

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl shadow-md border border-green-300 dark:border-green-700"
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station, idx) => {
          const info = station.AddressInfo || {};
          const conn = station.Connections?.[0] || {};

          return (
            <div
              key={idx}
              className="bg-white dark:bg-green-900 text-gray-900 dark:text-white border border-gray-300 dark:border-green-700 rounded-xl shadow p-5 space-y-2 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-green-800 dark:text-green-200">📍 {info.Title}</h3>
              <p className="text-sm">🏠 {info.AddressLine1}</p>
              <p className="text-sm">🗺️ {info.Town}, {info.State}</p>
              <p className="text-sm">📏 {info.Distance?.toFixed(2)} mi</p>

              <div className="flex gap-2 mt-3">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  onClick={() => scrollToMarker(station)}
                >
                  View on Map
                </button>
                <button
                  className="bg-white dark:bg-green-700 border border-gray-300 dark:border-green-600 hover:bg-gray-100 dark:hover:bg-green-600 text-sm text-gray-800 dark:text-white px-3 py-1 rounded"
                  onClick={() => toggleExpand(idx)}
                >
                  {expandedIndex === idx ? 'Hide Info' : 'More Info'}
                </button>
              </div>

              {expandedIndex === idx && (
                <div className="mt-3 border-t pt-3 transition-all duration-300 text-sm space-y-1 bg-gray-50 dark:bg-green-800 p-3 rounded-md">
                  <p>🔌 Connector: {conn.ConnectionType?.Title || 'Unknown'}</p>
                  <p>⚡ Level: {conn.Level?.Title || 'N/A'}</p>
                  <p>🔢 Ports: {conn.Quantity || '1'}</p>
                  {station.UsageCost && <p>💵 Cost: {station.UsageCost}</p>}
                  {info.ContactTelephone1 && (
                    <p>📞 Contact: {info.ContactTelephone1}</p>
                  )}
                  {info.AccessComments && (
                    <p className="text-gray-500 italic dark:text-gray-300">📝 {info.AccessComments}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default House;
