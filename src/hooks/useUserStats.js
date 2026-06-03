import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const CURRENT_CHALLENGE = "Green Commuter Week";

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekDocId(monday, challengeTitle, uid) {
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${challengeTitle}_${y}-${m}-${d}_${uid}`;
}

export function useUserStats(user) {
  const [carbonHistory, setCarbonHistory] = useState([]);
  const [challengeStats, setChallengeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        // Carbon history — reuses the (userId + timestamp desc) index from CarbonCalculator
        const carbonQ = query(
          collection(db, "carbon_history"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(30)
        );
        const carbonSnap = await getDocs(carbonQ);
        const history = carbonSnap.docs
          .map((d) => ({
            date: new Date(d.data().timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            co2: parseFloat(d.data().result),
            timestamp: d.data().timestamp,
          }))
          .reverse(); // ascending order for chart display
        setCarbonHistory(history);

        // Total challenge days — single where("uid") needs no composite index
        const chalQ = query(
          collection(db, "challengeProgress"),
          where("uid", "==", user.uid)
        );
        const chalSnap = await getDocs(chalQ);
        const totalDays = chalSnap.docs.reduce(
          (sum, d) => sum + (d.data().completedDays || 0),
          0
        );

        // Current week's challenge doc — direct read by ID, no index needed
        const monday = getWeekStart(new Date());
        const docId = weekDocId(monday, CURRENT_CHALLENGE, user.uid);
        const currentSnap = await getDoc(doc(db, "challengeProgress", docId));
        const current = currentSnap.exists() ? currentSnap.data() : null;

        setChallengeStats({
          totalDays,
          currentWeekDays: current?.completedDays ?? 0,
          currentWeekProgress: current?.progress ?? Array(7).fill(false),
        });
      } catch (err) {
        console.error("useUserStats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user?.uid]);

  return { carbonHistory, challengeStats, loading };
}
