import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const redIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const House = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerCluster = useRef(null);
  const markersRef = useRef({});
  const [stations, setStations] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [boroughFilter, setBoroughFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([40.7128, -74.006], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    if (!markerCluster.current) {
      markerCluster.current = L.markerClusterGroup({
        disableClusteringAtZoom: 16,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
      });
      leafletMap.current.addLayer(markerCluster.current);
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        leafletMap.current.setView([latitude, longitude], 12);

        L.marker([latitude, longitude], {
          icon: L.divIcon({ html: '📍', className: 'emoji-pin' }),
        })
          .addTo(leafletMap.current)
          .bindPopup('📍 You are here')
          .openPopup();

        try {
          const res = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=50&key=YOUR_API_KEY`
          );
          const data = await res.json();
          setStations(data);

          markerCluster.current.clearLayers();
          markersRef.current = {};

          data.forEach((station) => {
            const info = station.AddressInfo;
            const coords = [info.Latitude, info.Longitude];

            const marker = L.marker(coords, { icon: redIcon }).bindPopup(
              `<strong>${info.Title}</strong><br/>${info.AddressLine1}`
            );

            markerCluster.current.addLayer(marker);
            markersRef.current[station.ID] = marker;
          });
        } catch (err) {
          console.error('⚠️ Fetch error:', err);
        }
      },
      () => {
        leafletMap.current.setView([40.7128, -74.006], 12);
      }
    );
  }, []);

  const saveFavorite = (station) => {
    const existing = favorites.find((fav) => fav.ID === station.ID);
    if (!existing) {
      const updated = [...favorites, station];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
      alert('❤️ Added to Favorites!');
    } else {
      alert('Already in Favorites!');
    }
  };

  const scrollToMarker = (station) => {
    const marker = markersRef.current[station.ID];
    if (marker && leafletMap.current) {
      leafletMap.current.setView(marker.getLatLng(), 17);
      marker.openPopup();
    }
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const filteredStations = stations.filter((station) => {
    const info = station.AddressInfo || {};
    const conn = station.Connections?.[0] || {};

    const matchesSearch = info.Title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBorough = boroughFilter ? info.Town?.toLowerCase().includes(boroughFilter.toLowerCase()) : true;
    const matchesLevel = levelFilter ? conn.Level?.Title?.includes(levelFilter) : true;

    return matchesSearch && matchesBorough && matchesLevel;
  });

  const sortedStations = [...filteredStations].sort((a, b) => {
    return (a.AddressInfo?.Distance || 0) - (b.AddressInfo?.Distance || 0);
  });

  useEffect(() => {
    if (!markerCluster.current) return;

    markerCluster.current.clearLayers();
    filteredStations.forEach((station) => {
      const marker = markersRef.current[station.ID];
      if (marker) {
        markerCluster.current.addLayer(marker);
      }
    });
  }, [filteredStations]);

  return (
    <div className="p-4 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by station name..."
          className="border border-gray-300 dark:border-green-600 dark:bg-green-900 dark:text-white rounded px-4 py-2 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-green-600 dark:bg-green-900 dark:text-white rounded px-4 py-2 w-full md:w-auto"
          value={boroughFilter}
          onChange={(e) => setBoroughFilter(e.target.value)}
        >
          <option value="">All Boroughs</option>
          <option value="Brooklyn">Brooklyn</option>
          <option value="Queens">Queens</option>
          <option value="Manhattan">Manhattan</option>
          <option value="Bronx">Bronx</option>
          <option value="Staten Island">Staten Island</option>
        </select>
        <select
          className="border border-gray-300 dark:border-green-600 dark:bg-green-900 dark:text-white rounded px-4 py-2 w-full md:w-auto"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="Level 1">Level 1</option>
          <option value="Level 2">Level 2</option>
          <option value="Level 3">Level 3 (DC Fast)</option>
        </select>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          onClick={() => {
            setSearchQuery('');
            setBoroughFilter('');
            setLevelFilter('');
          }}
        >
          Reset
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl shadow-md border border-green-300 dark:border-green-700"
      />

      {/* Stations */}
      {sortedStations.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-6">
          🚫 No EV Charging Stations found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sortedStations.map((station, idx) => {
            const info = station.AddressInfo || {};
            const conn = station.Connections?.[0] || {};

            return (
              <div
                key={station.ID}
                className="bg-white dark:bg-green-900 text-gray-900 dark:text-white border border-gray-300 dark:border-green-700 rounded-xl shadow p-5 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-green-800 dark:text-green-200">
                  📍 {info.Title}
                </h3>
                <p className="text-sm">🏠 {info.AddressLine1}</p>
                <p className="text-sm">🏙️ {info.Town}, {info.State}</p>
                <p className="text-sm">⭐ {info.Distance?.toFixed(2)} mi</p>
                <p className="text-sm">⚡ {conn.Level?.Title || 'Unknown Level'}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => scrollToMarker(station)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  >
                    View on Map
                  </button>
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="bg-white dark:bg-green-700 border border-gray-300 dark:border-green-600 hover:bg-gray-100 dark:hover:bg-green-600 text-sm text-gray-800 dark:text-white px-3 py-1 rounded"
                  >
                    {expandedIndex === idx ? 'Hide Info' : 'More Info'}
                  </button>
                  <button
                    onClick={() => saveFavorite(station)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    ❤️ Favorite
                  </button>
                </div>

                {expandedIndex === idx && (
                  <div className="mt-3 border-t pt-3 transition-all duration-300 text-sm space-y-1 bg-gray-50 dark:bg-green-800 p-3 rounded-md">
                    <p>🔌 Connector: {conn.ConnectionType?.Title || 'Unknown'}</p>
                    <p>⚡ Level: {conn.Level?.Title || 'N/A'}</p>
                    <p>🔢 Ports: {conn.Quantity || '1'}</p>
                    {station.UsageCost && <p>💵 Cost: {station.UsageCost}</p>}
                    {info.ContactTelephone1 && <p>📞 Contact: {info.ContactTelephone1}</p>}
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
      )}
    </div>
  );
};

export default House;
