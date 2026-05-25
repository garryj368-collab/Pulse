import React, { useState } from "react";
import { UserProfile, DailyStats } from "../types";

interface DashProps {
  userProfile: UserProfile;
  dailyStats: DailyStats;
  onStartWorkout: () => void;
  onIncrementSteps: (amount: number) => void;
  onTabChange: (tab: string) => void;
}

export default function Dash({
  userProfile,
  dailyStats,
  onStartWorkout,
  onIncrementSteps,
  onTabChange,
}: DashProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Steps Progress calculations
  const stepsGoal = userProfile.dailyStepsGoal;
  const stepsPercent = Math.min((dailyStats.steps / stepsGoal) * 100, 100);
  
  // SVG Circumference for radius=50 is 2 * Math.PI * 50 = 314.159
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stepsPercent / 100) * circumference;

  // Weekly values
  const weeklyData = [
    { day: "M", value: "6.2k", height: "60%" },
    { day: "T", value: "8.1k", height: "80%" },
    { day: "W", value: "4.5k", height: "40%" },
    { day: "T", value: `${(dailyStats.steps / 1000).toFixed(1)}k`, height: `${stepsPercent}%`, isToday: true },
    { day: "F", value: "0.0k", height: "0%" },
    { day: "S", value: "0.0k", height: "0%" },
    { day: "S", value: "0.0k", height: "0%" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative z-10">
      {/* Daily Progress Section */}
      <section className="flex flex-col items-center justify-center relative mt-2">
        <h2 className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase self-start mb-4">
          Daily Progress
        </h2>

        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full absolute inset-0 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]" viewBox="0 0 120 120">
            {/* Background Ring */}
            <circle
              className="text-white/10"
              cx="60"
              cy="60"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
            />
            {/* Progress Ring with Blue Glow */}
            <circle
              className="text-blue-400 transition-all duration-700 ease-out"
              cx="60"
              cy="60"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>

          {/* Core center contents */}
          <div className="flex flex-col items-center z-10 text-center px-4">
            <span className="material-symbols-outlined text-blue-400 text-3xl mb-1 fill-current">
              directions_run
            </span>
            <div className="text-4xl font-extrabold tracking-tight text-white leading-none">
              {dailyStats.steps.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-slate-400 tracking-wider mt-1.5 font-bold">
              / {stepsGoal.toLocaleString()} STEPS
            </div>
          </div>
        </div>

        {/* Quick simulator helper */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onIncrementSteps(500)}
            className="text-[10px] font-mono glass-card hover:bg-white/10 text-white py-1.5 px-3 rounded-full active:scale-95 transition-all cursor-pointer"
            id="sim-increment-steps-500"
          >
            +500 Steps Walked
          </button>
          <button
            onClick={() => onIncrementSteps(2000)}
            className="text-[10px] font-mono glass-card hover:bg-white/10 text-white py-1.5 px-3 rounded-full active:scale-95 transition-all cursor-pointer"
            id="sim-increment-steps-2000"
          >
            +2,000 Steps Run
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Calories Card */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex items-center space-x-2 z-10">
            <span className="material-symbols-outlined text-orange-400 text-[20px] fill-current">
              local_fire_department
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              CALORIES
            </span>
          </div>
          <div className="z-10 flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {dailyStats.calories}
            </span>
            <span className="text-xs text-slate-400 font-medium">kcal</span>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex items-center space-x-2 z-10">
            <span className="material-symbols-outlined text-pink-500 text-[20px] animate-pulse-heart fill-current">
              favorite
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              HEART RATE
            </span>
          </div>
          <div className="z-10 flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {dailyStats.heartRate}
            </span>
            <span className="text-xs text-slate-400 font-medium">bpm</span>
          </div>
        </div>

        {/* Active Minutes Card */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group col-span-2 md:col-span-1">
          <div className="flex items-center space-x-2 z-10">
            <span className="material-symbols-outlined text-purple-400 text-[20px] fill-current">
              timer
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              ACTIVE
            </span>
          </div>
          <div className="z-10 flex flex-col w-full">
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-3xl font-bold text-white tracking-tight">
                {dailyStats.activeMinutes}
              </span>
              <span className="text-xs text-slate-400 font-medium">mins</span>
            </div>
            {/* Custom mini interactive progress bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dailyStats.activeMinutes / 60) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Activity section */}
      <section className="glass rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-mono text-xs font-bold tracking-widest text-slate-300 uppercase">
            Weekly Activity
          </h3>
          <button
            onClick={() => onTabChange("stats")}
            className="text-xs text-blue-400 hover:text-white transition-colors uppercase font-mono tracking-wider cursor-pointer"
          >
            Details
          </button>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-40 flex items-end justify-between space-x-3 pt-6 border-b border-white/10 relative">
          {weeklyData.map((d, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full group cursor-pointer relative"
              onMouseEnter={() => setHoveredDay(d.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {/* Tooltip on hover */}
              <div
                className={`absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-xl border border-white/10 pointer-events-none transition-all duration-150 z-20 ${
                  hoveredDay === d.day ? "opacity-100 scale-100" : "opacity-0 scale-90 translate-y-1"
                }`}
              >
                {d.value}
              </div>

              {/* Bar layout */}
              <div
                className={`w-full max-w-[28px] rounded-t-sm transition-all duration-500 relative ${
                  d.isToday
                    ? "bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                    : "bg-white/15 group-hover:bg-blue-400/50"
                }`}
                style={{ height: d.height === "0%" ? "4px" : d.height }}
              ></div>

              <span
                className={`font-mono text-xs mt-2.5 ${
                  d.isToday ? "text-blue-400 font-bold" : "text-slate-400"
                }`}
              >
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Start Workout Primary Call to Action */}
      <section className="pb-2 mt-2">
        <button
          onClick={onStartWorkout}
          className="w-full bg-blue-500 text-white font-bold py-4 rounded-3xl shadow-[0_4px_15px_rgba(59,130,246,0.35)] hover:bg-blue-600 transition-all active:scale-[0.98] duration-200 flex items-center justify-center space-x-2 text-base cursor-pointer"
          id="btn-start-workout-dash"
        >
          <span className="material-symbols-outlined text-2xl font-bold fill-current">
            play_arrow
          </span>
          <span className="tracking-tight uppercase">START WORKOUT</span>
        </button>
      </section>
    </div>
  );
}
