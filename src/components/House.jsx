import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const House = () => {
  const mapRef = useRef(null);
  const [stations, setStations] = useState([]);

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

        L.marker([latitude, longitude])
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
              const name = coords.Title || 'Unnamed Station';
              const address = coords.AddressLine1 || 'No address';
              L.marker([coords.Latitude, coords.Longitude])
                .addTo(map)
                .bindPopup(`<strong>${name}</strong><br/>${address}`);
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
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-green-900 dark:text-green-100 mb-4">
        ⚡ Nearby EV Charging Stations
      </h2>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-3xl shadow-2xl border border-green-300 dark:border-green-800 overflow-hidden"
      ></div>

      {/* Station List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            No charging stations found.
          </p>
        ) : (
          stations.map((station, i) => {
            const info = station.AddressInfo;
            return (
              <div
                key={station.ID}
                className="backdrop-blur-lg bg-white/70 dark:bg-green-900/60 border border-green-200 dark:border-green-700 rounded-2xl shadow-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
                style={{ animation: `fadeIn 0.4s ease ${i * 0.05}s forwards` }}
              >
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-1">
                  🚗 {info?.Title || 'Unnamed Station'}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  📍 {info?.AddressLine1 || 'No address'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {info?.Town || ''} {info?.StateOrProvince || ''} {info?.Postcode || ''}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default House;
