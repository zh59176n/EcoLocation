// src/components/House.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './House.css';
import { db } from '../Firebase';
import {
  collection,
  writeBatch,
  doc,
  onSnapshot
} from 'firebase/firestore';

const House = () => {
  const mapRef       = useRef(null);
  const leafletMap   = useRef(null);
  const markersRef   = useRef({});      // { [stationId]: LeafletMarker }
  const [stations, setStations]     = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    // 1️⃣ Initialize map once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    // 2️⃣ Geolocate → fetch API → batch‑write to Firestore
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        leafletMap.current.setView([latitude, longitude], 13);

        L.marker([latitude, longitude], {
          icon: L.divIcon({ html: '📍', className: 'emoji-pin' })
        })
        .addTo(leafletMap.current)
        .bindPopup('📍 You are here')
        .openPopup();

        try {
          const res  = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=20&key=4f5bc103-bb45-47c1-8c5a-d4301b503a79`
          );
          const data = await res.json();

          // batch‑write all to Firestore
          const batch = writeBatch(db);
          data.forEach(station => {
            const id  = station.ID.toString();
            const ref = doc(db, 'chargingStations', id);
            batch.set(ref, station);
          });
          await batch.commit();
        } catch (err) {
          console.error('⚠️ Fetch/Write error:', err);
        }
      },
      () => {
        // fallback marker in NYC
        L.marker([40.7128, -74.0060], {
          icon: L.divIcon({ html: '📍', className: 'emoji-pin' })
        })
        .addTo(leafletMap.current)
        .bindPopup('📍 Default location: NYC')
        .openPopup();
      }
    );

    // 3️⃣ Real‑time listener for chargingStations
    const unsub = onSnapshot(collection(db, 'chargingStations'), snapshot => {
      snapshot.docChanges().forEach(change => {
        const data   = change.doc.data();
        const id     = change.doc.id;
        const info   = data.AddressInfo || {};
        const coords = info.Latitude && info.Longitude
          ? [info.Latitude, info.Longitude]
          : null;

        if (change.type === 'added' && coords) {
          // add new marker
          const m = L.marker(coords, {
            icon: L.divIcon({ html: '📍', className: 'emoji-pin' })
          })
          .addTo(leafletMap.current)
          .bindPopup(`<strong>${info.Title}</strong><br/>${info.AddressLine1}`);
          markersRef.current[id] = m;

        } else if (change.type === 'modified') {
          // update existing marker (position or popup)
          const m = markersRef.current[id];
          if (m && coords) {
            m.setLatLng(coords);
            m.getPopup().setContent(`<strong>${info.Title}</strong><br/>${info.AddressLine1}`);
          }

        } else if (change.type === 'removed') {
          // remove marker
          const m = markersRef.current[id];
          if (m) {
            m.remove();
            delete markersRef.current[id];
          }
        }
      });

      // keep React list in sync
      setStations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // cleanup on unmount
    return () => {
      unsub();
      Object.values(markersRef.current).forEach(m => m.remove());
    };
  }, []);

  const scrollToMarker = station => {
    const m = markersRef.current[station.id];
    if (leafletMap.current && m) {
      const latlng = m.getLatLng();
      leafletMap.current.setView(latlng, 15);
      m.openPopup();
    }
  };

  const toggleExpand = idx => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-2">
        🔌 Nearby EV Charging Stations
      </h2>

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl shadow-md border border-green-300 dark:border-green-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station, idx) => {
          const info = station.AddressInfo || {};
          const conn = station.Connections?.[0] || {};

          return (
            <div
              key={station.id}
              className="bg-white dark:bg-green-900 text-gray-900 dark:text-white border border-gray-300 dark:border-green-700 rounded-xl shadow p-5 space-y-2 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-green-800 dark:text-green-200">
                📍 {info.Title}
              </h3>
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
                    <p className="text-gray-500 italic dark:text-gray-300">
                      📝 {info.AccessComments}
                    </p>
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
