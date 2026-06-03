import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Firebase";
import { useFavorites } from "../hooks/useFavorites";
import { updateProfile } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  FaLeaf,
  FaMedal,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserCircle,
  FaTrophy,
  FaEdit,
  FaChargingStation,
  FaSolarPanel,
  FaTrash,
} from "react-icons/fa";

const avatarOptions = [
  "/Avatars/avatar1.png",
  "/Avatars/avatar2.png",
  "/Avatars/avatar3.png",
  "/Avatars/avatar4.png",
  "/Avatars/avatar5.png",
  "/Avatars/avatar6.png",
  "/Avatars/avatar7.png",
  "/Avatars/avatar8.png",
  "/Avatars/avatar9.png",
  "/Avatars/avatar10.png",
  "/Avatars/avatar11.png",
];

const challenges = [
  { title: "Green Commuter Week", key: "Green Commuter Week", icon: "🚲" },
  { title: "Energy Saver Week", key: "Energy Saver Week", icon: "💡" },
  { title: "No-Plastic Week", key: "No-Plastic Week", icon: "🚯" },
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
  const { favorites, removeFavorite } = useFavorites(user);
  const evFavorites = favorites.filter((f) => f.type === "ev");
  const solarFavorites = favorites.filter((f) => f.type === "solar");

  const [badgeCount, setBadgeCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weekProgress, setWeekProgress] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseMonday = new Date();
  baseMonday.setDate(baseMonday.getDate() - ((baseMonday.getDay() + 6) % 7));
  baseMonday.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!user) return;

    let cumulativePoints = 0;
    let totalBadges = 0;
    const tempAchievements = new Set();

    challenges.forEach((challenge, idx) => {
      const weekStart = new Date(baseMonday);
      weekStart.setDate(weekStart.getDate() + idx * 7);
      const weekKey = dateKey(weekStart, challenge.key);

      const ref = doc(db, "challengeProgress", `${weekKey}_${user.uid}`);
      onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setWeekProgress((prev) => ({ ...prev, [challenge.key]: data.progress }));
          const points = data.progress.filter(Boolean).length;
          cumulativePoints += points;

          if (points === 7) {
            totalBadges += 1;
            tempAchievements.add(`🏆 Mastered ${challenge.title}`);
          }
          if (points >= 1) {
            tempAchievements.add(`✅ Started ${challenge.title}`);
          }
        }
        setTotalPoints(cumulativePoints);
        setBadgeCount(totalBadges);
        setAchievements(Array.from(tempAchievements));
      });
    });

  }, [user]);

  const handleAvatarChange = async (url) => {
    if (user) {
      await updateProfile(user, { photoURL: url });
      setShowModal(false);
    }
  };


  const progressPercentage = Math.round((totalPoints / (challenges.length * 7)) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4 sm:p-6 rounded-lg shadow flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-2 border-green-500 shadow-lg object-cover transition-transform hover:scale-105"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-green-500" />
          )}
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full hover:bg-green-600 shadow"
            title="Change Avatar"
          >
            <FaEdit />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">Welcome,</h1>
          <p className="text-green-700 dark:text-green-300 text-base sm:text-lg mb-2 break-words">
            {user?.displayName || user?.email}
          </p>
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 shadow-inner overflow-hidden">
            <div
              className="bg-green-500 h-5 text-xs font-bold text-white text-center transition-all duration-700 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage}%
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <FaLeaf className="inline mr-1" /> Total Points: {totalPoints}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <FaMedal className="inline mr-1" /> Badges Earned: {badgeCount}
            </p>
            {achievements.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold flex items-center text-gray-700 dark:text-gray-300">
                  <FaTrophy className="inline mr-2 text-yellow-500" /> Achievements
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">Choose an Avatar</h2>
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  className="w-20 h-20 rounded-full border-2 border-gray-300 hover:border-green-500 cursor-pointer transition-transform transform hover:scale-110 hover:shadow-lg"
                  onClick={() => handleAvatarChange(url)}
                />
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

{/* Favorites Section */}
<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105">
  <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700 dark:text-green-300 mb-4">
    ❤️ Your Favorites
  </h2>
  {evFavorites.length === 0 && solarFavorites.length === 0 ? (
    <p className="text-gray-600 dark:text-gray-400">You haven't added any favorites yet.</p>
  ) : (
    <>
      {/* EV Favorites */}
      {evFavorites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
            <FaChargingStation /> EV Charging Stations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evFavorites.map((fav) => (
              <div
                key={fav.stationId}
                className="border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow flex flex-col gap-3 transition-transform hover:scale-105 hover:shadow-xl"
              >
                <p className="font-bold text-green-800 dark:text-green-200">{fav.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{fav.address}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeFavorite(fav.stationId)}
                    className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-2 py-1 rounded-full w-max">
                  EV Charger
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solar Favorites */}
      {solarFavorites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <FaSolarPanel /> Solar Providers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solarFavorites.map((fav) => (
              <div
                key={fav.stationId}
                className="border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg shadow flex flex-col gap-3 transition-transform hover:scale-105 hover:shadow-xl"
              >
                <p className="font-bold text-yellow-800 dark:text-yellow-200">{fav.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{fav.address}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeFavorite(fav.stationId)}
                    className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100 px-2 py-1 rounded-full w-max">
                  Solar Provider
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</div>

{/* Weekly Challenges */}
{challenges.map((challenge, idx) => {
  const weekStart = new Date(baseMonday);
  weekStart.setDate(weekStart.getDate() + idx * 7);
  const weekDates = getWeekDates(weekStart);
  const progress = weekProgress[challenge.key] || [];
  const isEven = idx % 2 === 0;

  return (
    <div
      key={challenge.key}
      className={`p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 ${
        isEven ? "bg-green-200 dark:bg-green-900" : "bg-blue-200 dark:bg-blue-900"
      }`}
    >
      <h2 className="text-xl font-bold flex items-center gap-2 text-green-800 dark:text-green-200 mb-4">
        <FaCalendarAlt className="text-blue-400 animate-spin-slow" /> {challenge.title} {challenge.icon}
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 overflow-x-auto">
        {weekDates.map((date, dayIdx) => {
          const isCompleted = progress[dayIdx];
          const fullDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <div
              key={dayIdx}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-full text-white font-bold shadow text-center ${
                isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span>{isCompleted ? <FaCheckCircle /> : date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}</span>
              <span className="text-[10px] mt-1 text-gray-700 dark:text-gray-300">{fullDate}</span>
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
