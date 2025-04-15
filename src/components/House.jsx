// src/components/House.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './House.css'; // <-- You’ll create this file below

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

        // ✅ User Location Pin
        L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'emoji-pin',
            html: '📍',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          }),
        })
          .addTo(leafletMap.current)
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
              const marker = L.marker([coords.Latitude, coords.Longitude], {
                icon: L.divIcon({
                  className: 'emoji-pin',
                  html: '📍',
                  iconSize: [24, 24],
                  iconAnchor: [12, 24],
                }),
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
      leafletMap.current.setView(station.__coords, 16);
      station.__marker.openPopup();
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-green-900 mb-2">
        🔌 Nearby EV Charging Stations
      </h2>

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl shadow-md border border-green-300"
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station, idx) => {
          const info = station.AddressInfo || {};
          const conn = station.Connections?.[0] || {};

          return (
            <div
              key={idx}
              className="bg-white border border-gray-300 rounded-xl shadow p-5 space-y-2 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                📍 {info.Title}
              </h3>
              <p className="text-sm">🏠 {info.AddressLine1}</p>
              <p className="text-sm">🌆 {info.Town}, {info.State}</p>
              <p className="text-sm">📏 {info.Distance?.toFixed(2)} mi</p>

              <div className="flex gap-2 mt-3">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  onClick={() => scrollToMarker(station)}
                >
                  View on Map
                </button>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded"
                  onClick={() => toggleExpand(idx)}
                >
                  {expandedIndex === idx ? 'Hide Info' : 'More Info'}
                </button>
              </div>

              {expandedIndex === idx && (
                <div className="mt-3 border-t pt-3 bg-gray-50 p-3 rounded-md text-sm space-y-1">
                  <p>🔌 Connector: {conn.ConnectionType?.Title || 'Unknown'}</p>
                  <p>⚡ Level: {conn.Level?.Title || 'N/A'}</p>
                  <p>🔢 Ports: {conn.Quantity || '1'}</p>
                  {station.UsageCost && <p>💵 Cost: {station.UsageCost}</p>}
                  {info.ContactTelephone1 && (
                    <p>📞 Contact: {info.ContactTelephone1}</p>
                  )}
                  {info.AccessComments && (
                    <p className="text-gray-500 italic">📝 {info.AccessComments}</p>
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
