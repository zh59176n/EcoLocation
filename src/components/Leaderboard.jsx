import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

const medalIcons = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ weekStart, user, completedDays, className }) {
  const [leaders, setLeaders] = useState([]);
  const weekKey = weekStart.toISOString().split("T")[0];

  // Save this user's current progress
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    setDoc(
      ref,
      {
        weekStart: weekKey,
        uid: user.uid,
        displayName: user.displayName || user.email.split("@")[0],
        completedDays,
      },
      { merge: true }
    ).catch((err) => console.error("Leaderboard write failed:", err));
  }, [user, weekKey, completedDays]);

  // Real-time leaderboard fetching
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
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 text-center mb-6">
        🏆 Weekly Eco Leaderboard
      </h3>

      {leaders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No entries yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {leaders.map((u, i) => (
            <div
              key={u.uid}
              className={`flex justify-between items-center px-4 py-2 rounded-md ${
                i === 0
                  ? "bg-green-100 dark:bg-green-700"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl">{medalIcons[i] || "🎖️"}</span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-all">
                  {u.displayName}
                </span>
              </div>
              <div className="text-green-700 dark:text-green-300 font-bold">{u.completedDays}/7</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
