import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { auth } from "../Firebase";
import Confetti from "react-confetti";

const db = getFirestore();

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { width: size[0], height: size[1] };
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const EcoChallenges = [
  "Green Commuter Week",
  "Energy Saver Week",
  "No‑Plastic Week",
  "Meat‑Free Days",
  "Water Watch Week"
];

export default function Profile() {
  const [user] = useAuthState(auth);
  const { width, height } = useWindowSize();

  const [points, setPoints] = useState(0);
  const [progress, setProgress] = useState(Array(7).fill(false));
  const [leaders, setLeaders] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [badges, setBadges] = useState(0);

  // 🔁 FIXED: Use correct weekKey based on Monday
  const currentMonday = getWeekStart(new Date());
  const weekKey = formatWeekKey(currentMonday);
  const progressPercent = Math.min((points / 20) * 100, 100);

  useEffect(() => {
    if (!user) return;

    const progressRef = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    const unsub = onSnapshot(progressRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.progress)) {
          setProgress(d.progress);
          const completedDays = d.progress.filter(Boolean).length;
          setPoints(completedDays * 3); // 3 points per completed day
          setBadges(Math.floor((completedDays * 3) / 20));
        }
      }
    });
    return unsub;
  }, [user, weekKey]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "leaderboard", weekKey), (snap) => {
      if (snap.exists()) {
        const all = snap.data().entries || [];
        const top = all.sort((a, b) => b.completedDays - a.completedDays).slice(0, 5);
        setLeaders(top);
        if (top.length && user && top[0].uid === user.uid) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }
      }
    });
    return unsub;
  }, [user, weekKey]);

  const currentChallenge =
    EcoChallenges[Math.floor(currentMonday.getTime() / (7 * 24 * 60 * 60 * 1000)) % EcoChallenges.length];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-green-200 to-green-300 dark:from-green-800 dark:via-green-900 dark:to-gray-800 px-4 py-10 text-gray-800 dark:text-gray-100">

      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      )}

      <div className="max-w-5xl mx-auto space-y-10">

        {/* User Header */}
        <div className="flex items-center justify-between bg-white dark:bg-green-900 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">Welcome,</h1>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-200">
              {user?.displayName || user?.email}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-300">Profile Page</p>
            <p className="text-xs">EcoLocation 🌎</p>
          </div>
        </div>

        {/* Green Points + Badges */}
        <div className="bg-white dark:bg-green-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🌿 Green Points & Badges</h2>

          <div className="bg-green-50 dark:bg-green-800 p-4 rounded-lg mb-4">
            <div className="text-xl font-semibold">Total Points: {points}</div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded-full overflow-hidden my-3">
              <div className="bg-green-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-1">🏅 Badges Earned: {badges}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: badges }).map((_, idx) => (
                  <span key={idx} className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🌟 Eco Badge #{idx + 1}
                  </span>
                ))}
                {badges === 0 && (
                  <p className="text-sm text-gray-500">Earn 20+ points to receive your first badge!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Challenge */}
        <div className="bg-white dark:bg-green-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📆 Weekly Eco Challenge</h2>
          <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
            Current Challenge: {currentChallenge}
          </p>
          <div className="flex gap-2 justify-center mt-4">
            {progress.map((dayCompleted, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                  dayCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {["S", "M", "T", "W", "T", "F", "S"][idx]}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-green-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🔥 This Week’s Top 5 Eco Heroes</h2>
          {leaders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No entries yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {leaders.map((leader, idx) => (
                <div key={leader.uid} className="flex justify-between text-lg">
                  <span>{idx + 1}. {leader.displayName}</span>
                  <span>{leader.completedDays}/7</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites */}
        <div className="bg-white dark:bg-green-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">❤️ Favorite Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-green-700 dark:text-green-200 mb-2">⚡ EV Charging Stations</h3>
              <ul className="text-sm space-y-1">
                <li>🔌 ChargePoint - Brooklyn</li>
                <li>🔋 EVgo Station - Queens</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-green-700 dark:text-green-200 mb-2">☀️ Solar Providers</h3>
              <ul className="text-sm space-y-1">
                <li>🌞 SunHarvest Solar - Manhattan</li>
                <li>🔆 BrightFuture Solar - Bronx</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
