import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useFavorites } from '../hooks/useFavorites';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Custom icon for solar providers
const solarIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/169/169367.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const SolarMap = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerCluster = useRef(null);
  const markersRef = useRef({});
  const [user] = useAuthState(auth);
  const { toggleFavorite: toggleFav, isFavorited } = useFavorites(user);
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [boroughFilter, setBoroughFilter] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([40.7128, -74.006], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    if (!markerCluster.current) {
      markerCluster.current = L.markerClusterGroup();
      leafletMap.current.addLayer(markerCluster.current);
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        leafletMap.current.setView([latitude, longitude], 12);

        // 📍 User location pin
        L.marker([latitude, longitude], {
          icon: L.divIcon({ html: '📍', className: 'emoji-pin' }),
        })
          .addTo(leafletMap.current)
          .bindPopup('📍 You are here')
          .openPopup();

        try {
          const res = await fetch(
            `https://api.openchargemap.io/v3/poi/?output=json&countrycode=US&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=50&key=4b28e9a4-80f7-4dd3-ab70-761860034964`
          );
          const data = await res.json();

          const solarFriendly = data.filter((provider) =>
            provider.Connections?.some((conn) =>
              conn.Level?.Title?.includes('Level 2') || conn.Level?.Title?.includes('Level 3')
            )
          );

          setProviders(solarFriendly);

          markerCluster.current.clearLayers();
          markersRef.current = {};

          solarFriendly.forEach((provider) => {
            const coords = [provider.AddressInfo.Latitude, provider.AddressInfo.Longitude];
            const marker = L.marker(coords, { icon: solarIcon }).bindPopup(
              `<strong>${provider.AddressInfo.Title}</strong><br/>${provider.AddressInfo.AddressLine1 || ''}`
            );
            markerCluster.current.addLayer(marker);
            markersRef.current[provider.ID] = marker;
          });
        } catch (err) {
          console.error('⚠️ Solar API fetch error:', err);
        }
      },
      () => {
        console.error('⚠️ Failed to get user location');
        leafletMap.current.setView([40.7128, -74.006], 12);
      }
    );
  }, []);

  const toggleFavorite = (provider) => toggleFav(provider, 'solar');

  const scrollToMarker = (provider) => {
    const marker = markersRef.current[provider.ID];
    if (marker && leafletMap.current) {
      leafletMap.current.setView(marker.getLatLng(), 17);
      marker.openPopup();
    }
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const filtered = providers.filter((p) => {
    const matchesName = p.AddressInfo?.Title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBorough = boroughFilter
      ? (p.AddressInfo?.Town?.toLowerCase() || '').includes(boroughFilter.toLowerCase())
      : true;
    return matchesName && matchesBorough;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search Solar Provider"
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
          <option value="brooklyn">Brooklyn</option>
          <option value="queens">Queens</option>
          <option value="manhattan">Manhattan</option>
        </select>
        <button
          onClick={() => {
            setSearchQuery('');
            setBoroughFilter('');
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl shadow-md border border-green-300 dark:border-green-700"
      />

      {/* Providers List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-6">🚫 No Providers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((provider, idx) => {
            const isProviderFavorited = isFavorited(provider.ID);
            return (
              <div
                key={provider.ID}
                className="bg-white dark:bg-green-900 text-gray-900 dark:text-white border border-gray-300 dark:border-green-700 rounded-xl shadow p-5 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-green-800 dark:text-green-200">
                  ☀️ {provider.AddressInfo.Title}
                </h3>
                <p className="text-sm">🏠 {provider.AddressInfo.AddressLine1}</p>
                <p className="text-sm">🏙️ {provider.AddressInfo.Town}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => scrollToMarker(provider)}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white text-sm px-3 py-1 rounded shadow"
                  >
                    View on Map
                  </button>
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white text-sm px-3 py-1 rounded shadow"
                  >
                    {expandedIndex === idx ? 'Hide Info' : 'More Info'}
                  </button>
                  <button
                    onClick={() => toggleFavorite(provider)}
                    className={`${
                      isProviderFavorited
                        ? 'bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800'
                        : 'bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700'
                    } text-white text-sm px-3 py-1 rounded shadow`}
                  >
                    ❤️ {isProviderFavorited ? 'Favorited' : 'Favorite'}
                  </button>
                </div>

                {expandedIndex === idx && (
                  <div className="mt-3 border-t pt-3 text-sm space-y-1 bg-gray-50 dark:bg-green-800 p-3 rounded-md">
                    <p>📞 Contact: {provider.AddressInfo.ContactTelephone1 || 'N/A'}</p>
                    <p>
                      🌐 Website:{' '}
                      {provider.AddressInfo.RelatedURL ? (
                        <a
                          href={provider.AddressInfo.RelatedURL}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-blue-400"
                        >
                          Visit Site
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </p>
                    <p>💼 Services: Solar Services (Simulated)</p>
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

export default SolarMap;
