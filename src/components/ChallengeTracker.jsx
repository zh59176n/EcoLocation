
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
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

function dateKey(date, weekTitle) {
  return `${weekTitle}_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const challenges = [
  { title: "Green Commuter Week", description: "Bike, walk, or use transit for all trips." },
  { title: "Energy Saver Week", description: "Unplug devices and switch to efficient lighting." },
  { title: "No-Plastic Week", description: "Say no to plastic bags, bottles, and straws." },
];

export default function ChallengeTracker() {
  const [user] = useAuthState(auth);
  const { width, height } = useWindowSize();

  const [weekIndex, setWeekIndex] = useState(0);
  const currentChallenge = challenges[weekIndex];
  const baseMonday = getWeekStart(new Date());
  const adjustedMonday = new Date(baseMonday.getTime() + weekIndex * msPerWeek);
  const weekDates = getWeekDates(adjustedMonday);

  const today = new Date();
  const [progress, setProgress] = useState(Array(7).fill(false));
  const completedDays = progress.filter(Boolean).length;
  const [showConfetti, setShowConfetti] = useState(false);

  const weekKey = dateKey(adjustedMonday, currentChallenge.title);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.progress) && d.progress.length === 7) setProgress(d.progress);
      } else {
        setProgress(Array(7).fill(false));
      }
    });
  }, [user, weekKey]);

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
    const dayDate = weekDates[idx];
    if (dayDate > today) {
      toast("⏳ This day hasn't arrived yet!", { icon: "🗓️" });
      return;
    }
    const updated = progress.map((v, i) => (i === idx ? !v : v));
    setProgress(updated);
    saveProgress(updated);

    if (!progress[idx]) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const resetProgress = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Reset this week's progress?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const empty = Array(7).fill(false);
              setProgress(empty);
              saveProgress(empty);
              toast.dismiss(t.id);
              toast.success("Progress reset.");
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Yes, reset
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={200} recycle={false} className="pointer-events-none fixed inset-0 z-50" />
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

      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-white/10 p-6 rounded-2xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setWeekIndex(prev => Math.max(prev - 1, 0))}
            disabled={weekIndex === 0}
            className={`text-green-500 hover:underline ${weekIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            ← Previous
          </button>
          <h2 className="text-xl font-bold">{currentChallenge.title}</h2>
          <button
            onClick={() => setWeekIndex(prev => Math.min(prev + 1, challenges.length - 1))}
            disabled={weekIndex === challenges.length - 1}
            className={`text-green-500 hover:underline ${weekIndex === challenges.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Next →
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{currentChallenge.description}</p>

        <div className="text-right">
          <button
            onClick={resetProgress}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded"
          >
            Reset Progress
          </button>
        </div>

        <div className="text-green-700 font-semibold">
          ✅ Progress: {completedDays}/7 days completed {completedDays === 7 && "🎉"}
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(completedDays / 7) * 100}%` }} />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3 overflow-x-auto">
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString();
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

      </div>
    </div>
  );
}
