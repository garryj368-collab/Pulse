import React, { useState, useEffect, useRef } from "react";
import { ActivityLog } from "../types";

interface TrackProps {
  onAddActivity: (log: Omit<ActivityLog, "id">) => void;
  onTabChange: (tab: string) => void;
  onWorkoutComplete: (minutes: number, calories: number, steps: number) => void;
}

export default function Track({ onAddActivity, onTabChange, onWorkoutComplete }: TrackProps) {
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(1455); // Starting around 24:15 as in mockup (1455 seconds)
  
  // Simulated heart rate state (around 164 bpm, fluctuates)
  const [hr, setHr] = useState(164);
  
  // Timer interval reference
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Math variables
  // Realistic outdoor run metrics starting values
  // Distance = Pace * Time
  // Pace is ~5'12" (5.2 minutes per km) -> 5.2 min/km = 312 seconds per km
  // At 1455 seconds, distance should be 1455 / 312 = 4.66 km. Mockup says 3.24 km (maybe they walked or ran slower, let's match the exact mockup values initially then tick upward!)
  const initialDistance = 3.24;
  const initialSecondsAtMockup = 1455; // 24:15
  
  // Calculate current distance: distance goes up by roughly 0.003 km per second of running
  const elapsedSinceStart = seconds - initialSecondsAtMockup;
  const rawDistance = Math.max(0, initialDistance + (elapsedSinceStart * 0.0031));
  const distanceStr = rawDistance.toFixed(2);

  // Dynamic pace calculation
  // paceSeconds = (seconds) / distance
  const currentPaceSeconds = rawDistance > 0 ? seconds / rawDistance : 312; 
  const paceMinutes = Math.floor(currentPaceSeconds / 60);
  const paceRemainingSeconds = Math.floor(currentPaceSeconds % 60);
  const paceStr = `${paceMinutes}'${paceRemainingSeconds.toString().padStart(2, "0")}"`;

  // Dynamic calories burned (roughly 0.12 kcal per second for running)
  const caloriesBurned = Math.round(seconds * 0.115);

  // SVG Map cursor track percentage
  // We can let the dot animate smoothly back and forth or linearly along a curve
  const routeProgress = (seconds % 600) / 600; // loop map path position every 10 mins

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
        
        // Fluctuate heart rate gently between 161 and 168
        setHr((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const next = prev + delta;
          return Math.max(158, Math.min(next, 172));
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handlePauseToggle = () => {
    setIsActive(!isActive);
  };

  const handleFinish = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Calculate total run details
    const finalMinutes = Math.round(seconds / 60);
    const finalKms = rawDistance.toFixed(1);
    const finalStepsFractionOfKms = Math.round(rawDistance * 1350); // roughly 1350 steps per km

    // Insert logged entry
    onAddActivity({
      title: "Outdoor Run",
      type: "run",
      date: "TODAY",
      durationMinutes: finalMinutes,
      metricValue: `${finalKms} km`,
    });

    // Award calories and active minutes to main dashboard
    onWorkoutComplete(finalMinutes, caloriesBurned, finalStepsFractionOfKms);

    // Swap back
    onTabChange("stats");
  };

  // Format Duration stopwatch: MM:SS
  const formatDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Map path dot mapping on the mockup route path
  // Custom quadratic curve path coordinates:
  // "M 50,120 C 100,100 150,140 200,80 S 250,20 300,50 350,90 400,60"
  // Let's approximate the X and Y coordinates along this route for the floating runner dot!
  const getDotCoords = (progress: number) => {
    // Smooth parametric approximations for visual appeal inside 100% boundary
    const x = 20 + progress * 360; // range 20 to 380 px
    const yValFraction = Math.sin(progress * Math.PI * 3.5);
    const y = 80 + yValFraction * 35; // range roughly 45 to 115 px
    return { x, y };
  };

  const dotPos = getDotCoords(routeProgress);

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative z-10">
      {/* Session Title Header */}
      <div className="flex justify-between items-center bg-transparent mt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400 text-2xl font-bold animate-pulse">
            sprint
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white">Outdoor Run</h1>
        </div>
        <div className="flex items-center gap-1.5 glass backdrop-blur-md px-3 py-1 rounded-full">
          <span className="material-symbols-outlined text-blue-400 text-sm font-bold fill-current">
            satellite_alt
          </span>
          <span className="font-mono text-[10px] font-bold text-blue-400 tracking-wider">
            GPS
          </span>
        </div>
      </div>

      {/* Main Core Metric: stopwatch timer */}
      <div className="flex flex-col items-center justify-center my-4 py-2">
        <span className="font-sans text-7xl font-extrabold tracking-tighter text-blue-400 text-glow tabular-nums select-none transition-all duration-300">
          {formatDuration(seconds)}
        </span>
        <span className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase mt-2.5">
          DURATION
        </span>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {/* Distance (Spans 2 cols) */}
        <div className="col-span-2 glass-card rounded-2xl p-4 flex items-end justify-between relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] w-28 h-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col z-10">
            <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wide uppercase mb-1">
              Distance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {distanceStr}
              </span>
              <span className="text-sm font-medium text-slate-400">km</span>
            </div>
          </div>
          
          <div className="h-12 w-12 rounded-full glass flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl fill-current">
              route
            </span>
          </div>
        </div>

        {/* Pace */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28">
          <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wide uppercase">
            Pace
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {paceStr}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">/km</span>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wide uppercase">
              Avg HR
            </span>
            <span className="material-symbols-outlined text-pink-500 text-lg fill-current animate-pulse-heart">
              favorite
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white tracking-tight">
              {hr}
            </span>
            <span className="text-xs text-slate-400">bpm</span>
          </div>
        </div>
      </div>

      {/* Styled Interactive Live Map View */}
      <div className="w-full h-36 rounded-2xl glass-card relative overflow-hidden shrink-0 flex items-center justify-center">
        {/* Dark map grayscale street image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale filter contrast-125"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBk0rU3b3Pu8YVUpPcq0KRp50r1Nb7pRZWfwy_BxCFfq48ylAOwtECIPMA25DPqnqOTixA9fvp-svaufhcB0N98ODYWXGu5ey1JOReO98qkz2IgJuf_DmsoHyj4nI_rcVmbB8tmbBvD-PKet78I8WIJP1Dc4bDnk46o-XIkybpBZIA8J9eWpFyqIWd7P4kkQuq85oXHFy2d6jqd_7Kpk-TNOQMKMyB3AeaepZiN0sbtDvKOQefHH88F82HyjmQvTyRdxaH7Yatm5TE')`,
          }}
        ></div>
        
        {/* Overlay gradient shroud */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>

        {/* Route visualization SVG overlay */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" preserveAspectRatio="none" viewBox="0 0 400 150">
          <path
            d="M 50,120 C 100,100 150,140 200,80 S 250,20 300,50 350,90 400,60"
            fill="none"
            stroke="#3b82f6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.5"
          />
          {/* Tracker animated dot cursor representing user's coordinate mapping progression */}
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            fill="#020617"
            r="6.5"
            stroke="#3b82f6"
            strokeWidth="3"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        <div className="absolute bottom-3 left-3 bg-slate-950/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-slate-300 border border-white/10 shadow-md">
          Live Tracking
        </div>
      </div>

      {/* Control Actions buttons area */}
      <div className="mt-auto px-1 pt-4 pb-2">
        <div className="flex gap-4">
          {/* Pause / Resume Button */}
          <button
            onClick={handlePauseToggle}
            className={`flex-1 h-14 border rounded-3xl flex items-center justify-center gap-2 active:scale-95 transition-all text-base font-semibold cursor-pointer ${
              isActive
                ? "bg-transparent border-white/10 text-white hover:bg-white/5"
                : "bg-emerald-950/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/40"
            }`}
            id="btn-pause-track"
          >
            <span className="material-symbols-outlined text-xl fill-current">
              {isActive ? "pause" : "play_arrow"}
            </span>
            <span>{isActive ? "Pause" : "Resume"}</span>
          </button>
          
          {/* Finish Button */}
          <button
            onClick={handleFinish}
            className="flex-1 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.35)] active:scale-[0.97] transition-all text-base font-bold cursor-pointer"
            id="btn-finish-track"
          >
            <span className="material-symbols-outlined text-xl">
              stop
            </span>
            <span>Finish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
