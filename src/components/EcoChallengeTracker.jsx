// EcoChallengeTracker.jsx
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Confetti from "react-confetti";
import { auth, db } from "../Firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import Leaderboard from "./Leaderboard";

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { width: size[0], height: size[1] };
}

const msPerWeek = 6048e5;

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(start) {
  return [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const challenges = [
  { title: "Green Commuter Week", description: "Bike, walk, or use transit for all trips." },
  { title: "Energy Saver Week", description: "Unplug devices and switch to efficient lighting." },
  { title: "No-Plastic Week", description: "Say no to plastic bags, bottles, and straws." },
];

const dailyChallenges = [
  "Bring your own cup to a café ☕",
  "Walk or bike instead of driving 🚲",
  "Take a 3-minute shower 🚿",
  "Unplug 3 unused devices 🔌",
  "Recycle something today ♻️",
  "Skip meat for the day 🥗",
  "Share an eco-tip with a friend 💬"
];

const ecoTips = [
  {
    icon: "♻️",
    title: "Reduce Waste",
    description: "Avoid single-use plastics and recycle whenever possible.",
  },
  {
    icon: "🚲",
    title: "Greener Commute",
    description: "Bike, walk, or carpool instead of driving alone.",
  },
  {
    icon: "💡",
    title: "Save Energy",
    description: "Turn off lights and unplug chargers when not needed.",
  },
  {
    icon: "🌞",
    title: "Use Renewables",
    description: "Install solar panels or switch to green energy providers.",
  },
];

export default function EcoChallengeTracker() {
  const [user] = useAuthState(auth);
  const { width, height } = useWindowSize();

  const [weekOffset, setWeekOffset] = useState(0);
  const baseMonday = getWeekStart(new Date());
  const adjustedMonday = new Date(baseMonday.getTime() + weekOffset * msPerWeek);
  const weekKey = dateKey(adjustedMonday);
  const weekDates = getWeekDates(adjustedMonday);
  const today = new Date();
  const todayStr = today.toDateString();

  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const [progress, setProgress] = useState(Array(7).fill(false));
  const completedDays = progress.filter(Boolean).length;

  const challenge = challenges[(Math.floor(+adjustedMonday / msPerWeek)) % challenges.length];
  const dailyTip = dailyChallenges[todayIndex];
  const [showConfetti, setShowConfetti] = useState(false);

  // Load progress
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.progress) && d.progress.length === 7) {
          setProgress(d.progress);
        }
      }
    });
  }, [user, weekKey]);

  // Save progress
  const saveProgress = updated => {
    if (!user) return;
    setDoc(doc(db, "challengeProgress", `${weekKey}_${user.uid}`), {
      weekStart: weekKey,
      uid: user.uid,
      displayName: user.displayName || user.email.split("@")[0],
      progress: updated,
      completedDays: updated.filter(Boolean).length,
    }, { merge: true }).catch(console.error);
  };

  // Handle day toggle
  const toggleDay = idx => {
    const clickedDate = weekDates[idx];
    if (clickedDate > today) {
      alert("⏳ This day hasn't arrived yet!");
      return;
    }

    const updated = [...progress];
    updated[idx] = !updated[idx];

    setProgress(updated);
    saveProgress(updated);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Reset button
  const resetProgress = () => {
    if (window.confirm("Reset your progress for this week?")) {
      const empty = Array(7).fill(false);
      setProgress(empty);
      saveProgress(empty);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={false}
          className="pointer-events-none fixed inset-0 z-50"
        />
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">Weekly Eco Challenge</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your eco-wins and rise on the leaderboard!</p>
      </div>

      {user && (
        <Leaderboard
          weekStart={adjustedMonday}
          user={user}
          completedDays={completedDays}
        />
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <button onClick={() => setWeekOffset(w => Math.max(w - 1, 0))} className="text-green-600 hover:underline">← Previous</button>
          <h2 className="text-xl font-bold">{challenge.title}</h2>
          <button onClick={() => setWeekOffset(w => w + 1)} className="text-green-600 hover:underline">Next →</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>

        <div className="text-right">
          <button onClick={resetProgress} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Reset Progress</button>
        </div>

        <div className="text-green-700 font-semibold">
          ✅ Progress: {completedDays}/7 days completed {completedDays === 7 && "🎉"}
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(completedDays / 7) * 100}%` }} />
        </div>

        <div className="grid grid-cols-7 gap-2 mt-3">
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === todayStr;
            const isFuture = date > today;
            const isPastUnfilled = date < today && !progress[i];

            return (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                disabled={isFuture}
                className={`rounded p-2 text-sm font-medium transition-all ${
                  progress[i]
                    ? "bg-green-600 text-white"
                    : isPastUnfilled
                    ? "bg-red-400 text-white"
                    : isFuture
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-600"
                } ${isToday ? "ring-2 ring-green-500" : ""}`}
              >
                <div>{date.toLocaleDateString(undefined, { weekday: "short" })}</div>
                <div>{date.getDate()}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-2 text-sm italic text-blue-600 dark:text-blue-300">
          🔄 Today’s challenge: {dailyTip}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mt-10 mb-4">🌿 Sustainability Tips</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ecoTips.map((tip, i) => (
            <div key={i} className="bg-green-100 dark:bg-green-700 text-center p-4 rounded shadow">
              <div className="text-3xl mb-2">{tip.icon}</div>
              <div className="font-semibold text-green-800 dark:text-green-100">{tip.title}</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
