import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Confetti, { useWindowSize } from "react-confetti";
import { auth, db } from "../Firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import Leaderboard from "./Leaderboard";

/* ────────────────────────── helpers ────────────────────────── */
const msPerWeek = 6048e5; // 1000*60*60*24*7
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
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
/* ───────────────────────────────────────────────────────────── */

export default function EcoChallengeTracker() {
  const [user] = useAuthState(auth);
  const { width, height } = useWindowSize();

  /* ───────── week context ───────── */
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const weekKey   = dateKey(weekStart);
  const weekDates = getWeekDates(weekStart);

  /* ───────── rotating challenge ───────── */
  const challenges = [
    { title: "No‑Plastic Week", description: "Avoid single‑use plastics every day." },
    { title: "Green Commuter Week", description: "Bike, walk, or use transit for all trips." },
    { title: "Energy Saver Week", description: "Unplug devices when not in use." },
    { title: "Meat‑Free Days", description: "Eat vegetarian meals." },
    { title: "Water Watch Week", description: "Take short showers & fix any water leaks." },
  ];
  const challenge = challenges[(Math.floor(+weekStart / msPerWeek)) % challenges.length];

  /* ───────── progress state ───────── */
  const [progress, setProgress] = useState(Array(7).fill(false));
  const completedDays = progress.filter(Boolean).length;

  /* ───────── confetti state ───────── */
  const [showConfetti, setShowConfetti] = useState(false);

  /* ───────── real‑time load of saved progress ───────── */
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.progress) && d.progress.length === 7) setProgress(d.progress);
      }
    });
  }, [user, weekKey]);

  /* ───────── save progress on each toggle ───────── */
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
  const toggleDay = idx => {
    const updated = progress.map((v, i) => (i === idx ? !v : v));
    setProgress(updated);
    saveProgress(updated);
  };

  /* ───────── show confetti when user hits #1 ───────── */
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "challengeProgress"), snap => {
      const top = snap.docs
        .map(d => d.data())
        .filter(d => d.weekStart === weekKey)
        .sort((a, b) => b.completedDays - a.completedDays);
      if (top.length && top[0].uid === user.uid) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000); // 7 s rain
      }
    });
    return unsub;
  }, [user, weekKey]);

  /* ───────── auto‑rollover Monday ───────── */
  useEffect(() => {
    const id = setInterval(() => {
      const monday = getWeekStart(new Date());
      if (monday.getTime() !== weekStart.getTime()) {
        setWeekStart(monday);
        setProgress(Array(7).fill(false));
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [weekStart]);

  /* ───────────────────── UI ───────────────────── */
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow relative">
      {/* full‑page confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={false}
          className="pointer-events-none fixed inset-0 z-50"
        />
      )}

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Small, consistent actions add up—track your daily eco‑wins and see how you rank!
      </p>

      {user && (
        <Leaderboard
          weekStart={weekStart}
          user={user}
          completedDays={completedDays}
          className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded"
        />
      )}

      <h1 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">{challenge.title}</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{challenge.description}</p>

      <h2 className="font-semibold mb-2 text-gray-800 dark:text-white">Week of {weekStart.toLocaleDateString()}</h2>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDates.map((d, i) => (
          <button
            key={i}
            onClick={() => toggleDay(i)}
            className={`flex flex-col items-center justify-center p-2 border rounded focus:outline-none focus:ring-2 ${
              progress[i]
                ? "bg-green-600 text-white border-green-600"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
            }`}
          >
            <span className="text-xs">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
            <span className="text-sm">{d.getDate()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
