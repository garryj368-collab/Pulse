import React, { useState } from "react";
import { ActivityLog, Achievement } from "../types";

interface StatsProps {
  logs: ActivityLog[];
  achievements: Achievement[];
  onSelectWorkout: (log: ActivityLog) => void;
}

export default function Stats({ logs, achievements, onSelectWorkout }: StatsProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-4 relative z-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 mt-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Progress Insights</h2>
        <p className="text-sm text-slate-400">Track your performance over time.</p>
      </div>

      {/* Monthly Trends Chart Widget */}
      <section className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <h3 className="text-slate-100 font-semibold text-[17px]">Monthly Trends</h3>
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            CALORIES
          </span>
        </div>

        <div className="glass rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden group">
          {/* Subtle blue glow background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent z-0 pointer-events-none"></div>

          {/* Trend Metrics Header */}
          <div className="flex justify-between items-start z-10 relative">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white">2,450</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">
                  AVG KCAL
                </span>
              </div>
              <span className="text-xs text-blue-400 flex items-center gap-1 mt-1 font-medium">
                <span className="material-symbols-outlined text-[15px] font-bold">trending_up</span>
                +12% vs last month
              </span>
            </div>
            
            <div className="p-2 rounded-full glass text-slate-300">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </div>
          </div>

          {/* Majestic SVG Chart representation with waves, grid lines, and dots */}
          <div className="h-32 w-full mt-2 relative z-10 flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
              {/* Plot grids */}
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="10" y2="10" />
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20" />
              <line stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="30" y2="30" />
              
              {/* Under-plot ambient blue shaded Area */}
              <path
                d="M0,40 L0,33 Q15,25 30,31 T60,14 T85,24 L100,8 L100,40 Z"
                fill="url(#chart-gradient)"
                opacity="0.15"
              />

              {/* Background trace curve shadow glow */}
              <path
                className="opacity-30 blur-[3px]"
                d="M0,33 Q15,25 30,31 T60,14 T85,24 L100,8"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
              />

              {/* Main vector Bezier line */}
              <path
                d="M0,33 Q15,25 30,31 T60,14 T85,24 L100,8"
                fill="none"
                stroke="#3782f6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />

              {/* Custom SVG Gradient specs inside tag */}
              <defs>
                <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Key highlighted points */}
              <circle cx="30" cy="31" fill="#020617" r="2.5" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="60" cy="14" fill="#020617" r="2.5" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="100" cy="8" fill="#3b82f6" r="3.5" className="shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </svg>
          </div>
        </div>
      </section>

      {/* Achievements Horizontal Badge Scroller */}
      <section className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-100 font-semibold text-[17px]">Achievements</h3>
          <span className="font-mono text-[10px] text-blue-400 tracking-widest font-bold uppercase cursor-pointer">
            SEE ALL
          </span>
        </div>

        {/* Scrollable Badges tray */}
        <div className="flex gap-4 overflow-x-auto py-2.5 px-4 -mx-4 scrollbar-none snap-x">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-2.5 min-w-[80px] snap-start relative transition-all duration-200 cursor-pointer ${
                badge.earned ? "opacity-100 scale-100" : "opacity-45 hover:opacity-80 scale-95"
              }`}
              onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                  badge.earned
                    ? "glass border border-blue-500/50 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                    : "glass border border-white/5 text-slate-400"
                }`}
              >
                {/* Shimmer overlay animation on earned badge */}
                {badge.earned && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                  </div>
                )}

                <span className={`material-symbols-outlined text-[28px] ${badge.earned ? "fill-[#3b82f6]/40" : ""}`}>
                  {badge.icon}
                </span>

                {/* Sub-dot indicator representing elite badge star */}
                {badge.earned && (
                  <div className="absolute -top-1 -right-0.5 w-4 h-4 bg-blue-500 text-white rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-bold">
                    ★
                  </div>
                )}
              </div>

              <div className="text-center leading-tight flex flex-col items-center">
                <span className="font-mono text-[10px] font-bold text-white uppercase whitespace-nowrap">
                  {badge.title}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">
                  {badge.subtitle}
                </span>
              </div>

              {/* Badge expanded detail popup */}
              {selectedBadge === badge.id && (
                <div className="absolute top-[84px] glass text-white text-[10px] py-1.5 px-3 rounded-xl shadow-lg z-30 w-36 text-center leading-normal animate-fade-in pointer-events-none font-sans border border-white/10">
                  {badge.earned ? "✓ Completed achievement!" : "🔒 Unlocked at next fitness tier."}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity lists */}
      <section className="flex flex-col gap-2 mt-1">
        <h3 className="text-slate-100 font-semibold text-[17px] mb-1">Recent Activity</h3>
        
        <div className="flex flex-col gap-3">
          {logs.map((log) => {
            // Pick fitting vector icon based on activity
            let iconCode = "directions_run";
            if (log.type === "gym") iconCode = "fitness_center";
            if (log.type === "swim") iconCode = "pool";

            return (
              <div
                key={log.id}
                onClick={() => onSelectWorkout(log)}
                className="glass-card rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer hover:border-blue-400/40 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white border border-white/5">
                    <span className="material-symbols-outlined text-xl">{iconCode}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-white tracking-tight">
                      {log.title}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                      {log.date} <span className="text-[8px] opacity-40">•</span> {log.durationMinutes} MIN
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-white tracking-snug">
                    {log.metricValue.split(" ")[0]}
                    <span className="text-xs text-slate-400 font-normal ml-0.5">
                      {log.metricValue.split(" ")[1] || ""}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
