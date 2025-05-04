// Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const challenges = [
  { title: "Green Commuter Week", key: "Green Commuter Week" },
  { title: "Energy Saver Week", key: "Energy Saver Week" },
  { title: "No-Plastic Week", key: "No-Plastic Week" },
];

function getWeekDates(start) {
  return [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function dateKey(date, weekTitle) {
  return `${weekTitle}_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [badgeCount, setBadgeCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weekProgress, setWeekProgress] = useState({});

  const baseMonday = new Date();
  baseMonday.setDate(baseMonday.getDate() - ((baseMonday.getDay() + 6) % 7));
  baseMonday.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!user) return;

    challenges.forEach((challenge, idx) => {
      const weekStart = new Date(baseMonday);
      weekStart.setDate(weekStart.getDate() + idx * 7);
      const weekKey = dateKey(weekStart, challenge.key);

      const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
      onSnapshot(ref, snap => {
        if (snap.exists()) {
          const data = snap.data();
          setWeekProgress(prev => ({ ...prev, [challenge.key]: data.progress }));
          const points = data.progress.filter(Boolean).length;
          setTotalPoints(prev => prev + points);
          if (points === 7) {
            setBadgeCount(prev => Math.max(prev, idx + 1));
          }
        }
      });
    });
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
        <h1 className="text-2xl font-bold">Welcome,</h1>
        <p className="text-green-600 dark:text-green-300">{user?.email}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🌿 Green Points & Badges
        </h2>
        <div>Total Points: {totalPoints}</div>
        <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${Math.min(100, (totalPoints / 21) * 100)}%` }}
          />
        </div>
        <div>🏅 Badges Earned: {badgeCount}</div>
        {badgeCount > 0 &&
          [...Array(badgeCount)].map((_, i) => (
            <span key={i} className="inline-block bg-yellow-400 text-white px-3 py-1 rounded-full mr-2 mt-2">
              🌟 Eco Badge #{i + 1}
            </span>
          ))}
      </div>

      {challenges.map((challenge, idx) => {
        const weekStart = new Date(baseMonday);
        weekStart.setDate(weekStart.getDate() + idx * 7);
        const weekDates = getWeekDates(weekStart);

        return (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📅 {challenge.title}
            </h2>
            <div className="grid grid-cols-7 gap-2 mt-3">
              {weekDates.map((date, i) => {
                const completed = weekProgress[challenge.key]?.[i];
                return (
                  <div
                    key={i}
                    className={`rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm ${
                      completed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {date.toLocaleDateString(undefined, { weekday: "narrow" })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
