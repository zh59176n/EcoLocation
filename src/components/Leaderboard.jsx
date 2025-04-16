import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

export default function Leaderboard({ weekStart, user, completedDays, className }) {
  const [leaders, setLeaders] = useState([]);
  const weekKey = weekStart.toISOString().split("T")[0];

  /* 1. Persist this user’s progress every time it changes */
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    setDoc(
      ref,
      {
        weekStart   : weekKey,
        uid         : user.uid,
        displayName : user.displayName || user.email.split("@")[0],
        completedDays,
      },
      { merge: true }
    ).catch((err) => console.error("Leaderboard write failed:", err));
  }, [user, weekKey, completedDays]);

  /* 2. Real‑time listener (no composite index needed) */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "challengeProgress"),
      (snap) => {
        const top = snap.docs
          .map((d) => d.data())
          .filter((d) => d.weekStart === weekKey)
          .sort((a, b) => b.completedDays - a.completedDays)
          .slice(0, 5);
        setLeaders(top);
      },
      (err) => console.error("Leaderboard read failed:", err)
    );
    return unsubscribe;
  }, [weekKey]);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        🏆 This Week’s Top
      </h3>

      {leaders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No entries yet.</p>
      ) : (
        leaders.map((u, i) => (
          <div key={u.uid} className="flex justify-between text-gray-800 dark:text-gray-100">
            <span>{i + 1}. {u.displayName}</span>
            <span>{u.completedDays}/7</span>
          </div>
        ))
      )}
    </div>
  );
}
