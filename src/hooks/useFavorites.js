import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export function useFavorites(user) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setFavorites(snap.docs.map((d) => d.data()));
        setLoading(false);
      },
      (err) => {
        console.error("useFavorites:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [user?.uid]);

  const toggleFavorite = async (station, type) => {
    if (!user?.uid) return;
    const docId = `${user.uid}_${station.ID}`;
    const ref = doc(db, "favorites", docId);
    const exists = favorites.some((f) => f.stationId === station.ID);

    if (exists) {
      await deleteDoc(ref).catch(console.error);
    } else {
      await setDoc(ref, {
        userId: user.uid,
        type,
        stationId: station.ID,
        title: station.AddressInfo?.Title || "",
        address: station.AddressInfo?.AddressLine1 || "",
        town: station.AddressInfo?.Town || "",
        lat: station.AddressInfo?.Latitude,
        lng: station.AddressInfo?.Longitude,
        createdAt: Date.now(),
      }).catch(console.error);
    }
  };

  const removeFavorite = async (stationId) => {
    if (!user?.uid) return;
    const docId = `${user.uid}_${stationId}`;
    await deleteDoc(doc(db, "favorites", docId)).catch(console.error);
  };

  const isFavorited = (stationId) =>
    favorites.some((f) => f.stationId === stationId);

  return { favorites, toggleFavorite, removeFavorite, isFavorited, loading };
}
