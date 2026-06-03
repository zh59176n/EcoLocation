import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useUserStats } from "../hooks/useUserStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const US_DAILY_AVG_KG = 43.8;

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col gap-1">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {icon} {label}
      </p>
      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{value}</p>
      {sub && <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-28" />
        ))}
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-40" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-5xl">🌱</p>
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
        Start tracking your eco impact
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Your stats will appear here once you start using the tools below.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to="/carbon"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Carbon Calculator
        </Link>
        <Link
          to="/challenges"
          className="border border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 px-5 py-2 rounded-lg font-medium transition"
        >
          Weekly Challenges
        </Link>
        <Link
          to="/solar"
          className="border border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 px-5 py-2 rounded-lg font-medium transition"
        >
          Find EV Stations
        </Link>
      </div>
    </div>
  );
}

function CO2Chart({ data }) {
  const recent = data.slice(-2);
  const previous = data.slice(-4, -2);
  let trend = null;
  if (previous.length === 2) {
    const recentAvg = recent.reduce((s, d) => s + d.co2, 0) / recent.length;
    const prevAvg = previous.reduce((s, d) => s + d.co2, 0) / previous.length;
    trend = Math.round(((recentAvg - prevAvg) / prevAvg) * 100);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-green-800 dark:text-green-200">
          CO₂ Footprint Over Time
        </h2>
        {trend !== null && (
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              trend <= 0
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
            }`}
          >
            {trend <= 0 ? `↓ ${Math.abs(trend)}% improvement` : `↑ ${trend}% increase`}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Dashed line = US daily average (44 kg). Green bars are at or below average.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" kg" width={56} />
          <Tooltip
            formatter={(v) => [`${v} kg CO₂`, "Footprint"]}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine
            y={US_DAILY_AVG_KG}
            stroke="#9ca3af"
            strokeDasharray="4 2"
            label={{ value: "US avg", position: "insideTopRight", fontSize: 10, fill: "#9ca3af" }}
          />
          <Bar dataKey="co2" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.co2 <= US_DAILY_AVG_KG ? "#16a34a" : "#f59e0b"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChallengeWidget({ stats }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-800 dark:text-green-200">
          🌿 Green Commuter Week
        </h2>
        <Link
          to="/challenges"
          className="text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        {days.map((day, i) => (
          <div
            key={i}
            title={day}
            className={`flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold transition-colors ${
              stats.currentWeekProgress[i]
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {stats.currentWeekDays}/7 days completed this week
        {stats.currentWeekDays === 7 && " 🎉"}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const { carbonHistory, challengeStats, loading } = useUserStats(user);

  const hasData =
    carbonHistory.length > 0 || (challengeStats?.totalDays ?? 0) > 0;

  const totalCO2 = carbonHistory.reduce((sum, e) => sum + e.co2, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-100">
          Your Eco Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.displayName || user?.email?.split("@")[0]}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : !hasData ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon="🌍"
              label="Total CO₂ Tracked"
              value={`${totalCO2.toFixed(1)} kg`}
              sub={`${carbonHistory.length} calculation${carbonHistory.length !== 1 ? "s" : ""}`}
            />
            <StatCard
              icon="🏆"
              label="Challenge Days"
              value={challengeStats?.totalDays ?? 0}
              sub="Total days completed"
            />
            <StatCard
              icon="📅"
              label="This Week"
              value={`${challengeStats?.currentWeekDays ?? 0} / 7`}
              sub="Green Commuter Week"
            />
          </div>

          {carbonHistory.length >= 2 && <CO2Chart data={carbonHistory} />}

          {challengeStats && <ChallengeWidget stats={challengeStats} />}
        </div>
      )}
    </div>
  );
}
