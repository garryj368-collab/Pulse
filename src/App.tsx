import React, { useState, useEffect } from "react";
import { UserProfile, DailyStats, ActivityLog, Achievement, ThemeConfig } from "./types";
import Dash from "./components/Dash";
import Track from "./components/Track";
import Stats from "./components/Stats";
import Pro from "./components/Pro";
import Profile from "./components/Profile";

// Helper to convert #HEX to RGB triplet
function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "59, 130, 246";
}

// Predefined Themes configs in the applet
export const PREDEFINED_THEMES: ThemeConfig[] = [
  {
    id: "cyber-pulse",
    name: "Cyber Pulse",
    isDark: true,
    bg: "#020617",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    orb1: "#3b82f6",
    orb2: "#a855f7",
    orb3: "#ec4899",
    fontSans: "Inter",
    fontMono: "JetBrains Mono"
  },
  {
    id: "vapor-lime",
    name: "Toxic Lime",
    isDark: true,
    bg: "#090d16",
    text: "#f8fafc",
    textMuted: "#a1a1aa",
    accent: "#c3f400",
    accentHover: "#b6e000",
    orb1: "#c3f400",
    orb2: "#10b981",
    orb3: "#0284c7",
    fontSans: "Space Grotesk",
    fontMono: "Fira Code"
  },
  {
    id: "sunset-flare",
    name: "Sunset Flare",
    isDark: true,
    bg: "#110a08",
    text: "#fff7ed",
    textMuted: "#cbd5e1",
    accent: "#f97316",
    accentHover: "#ea580c",
    orb1: "#f97316",
    orb2: "#ef4444",
    orb3: "#eab308",
    fontSans: "Outfit",
    fontMono: "JetBrains Mono"
  },
  {
    id: "emerald-zen",
    name: "Emerald Sage",
    isDark: true,
    bg: "#06130a",
    text: "#f0fdf4",
    textMuted: "#a7f3d0",
    accent: "#10b981",
    accentHover: "#059669",
    orb1: "#10b981",
    orb2: "#047857",
    orb3: "#84cc16",
    fontSans: "Outfit",
    fontMono: "Fira Code"
  },
  {
    id: "sakura-aura",
    name: "Sakura Aura",
    isDark: true,
    bg: "#0f050d",
    text: "#fdf2f8",
    textMuted: "#f472b6",
    accent: "#ec4899",
    accentHover: "#db2777",
    orb1: "#ec4899",
    orb2: "#8b5cf6",
    orb3: "#db2777",
    fontSans: "Inter",
    fontMono: "JetBrains Mono"
  },
  {
    id: "snow-light",
    name: "Snow Light",
    isDark: false,
    bg: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    orb1: "#93c5fd",
    orb2: "#c084fc",
    orb3: "#fbcfe8",
    fontSans: "Space Grotesk",
    fontMono: "JetBrains Mono"
  }
];

// Standard default initial states for demo
const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Rivera",
  location: "Los Angeles, CA",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGqedcIb38GCijQ2G7il0utapEGv4XSfH6IU5mmxmExAsDCMN-Y_KeRiWFANAtvqk8GtYVESUqlB4dnZrgKPGVY8kPswCilhzob9ymAgJsDC6dn7JOiFcdT94cH0-5qZaEBaQNTOTl5ljIgMf2tmESKIucSqxBYMDkan6USnh4EgwKkaNyyDG2ZW0QEjksMm_hg5VDrEW2tOhOp5aGUapYti9Ub7bYVkg-NI8QlXMkaXat9fIdrEiejTihM9vC0unHIkWFC86B8Kk",
  age: 28,
  weight: 175,
  height: "6'1\"",
  dailyStepsGoal: 10000,
  weeklyWorkoutsGoal: 5,
  darkMode: true,
  pushNotifications: true,
  units: "IMPERIAL",
  isPro: false, // Let them upgrade and see the beautiful checkout experience on first click!
  themeId: "cyber-pulse",
  customThemes: [],
};

const DEFAULT_STATS: DailyStats = {
  steps: 8432,
  calories: 450,
  heartRate: 72,
  activeMinutes: 45,
};

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    title: "Morning Tempo",
    type: "run",
    date: "TODAY",
    durationMinutes: 45,
    metricValue: "5.2 mi",
  },
  {
    id: "act-2",
    title: "Upper Body Power",
    type: "gym",
    date: "YESTERDAY",
    durationMinutes: 60,
    metricValue: "420 cal",
  },
  {
    id: "act-3",
    title: "Recovery Swim",
    type: "swim",
    date: "MON",
    durationMinutes: 30,
    metricValue: "1,500 m",
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "7 Day Streak",
    subtitle: "Daily logs kept",
    icon: "workspace_premium",
    earned: true,
  },
  {
    id: "ach-2",
    title: "50k Steps",
    subtitle: "Total tier goal",
    icon: "directions_run",
    earned: true,
  },
  {
    id: "ach-3",
    title: "10k Climb",
    subtitle: "Terrain height",
    icon: "terrain",
    earned: false,
  },
  {
    id: "ach-4",
    title: "Sub 20 5K",
    subtitle: "Peak speed trial",
    icon: "timer",
    earned: false,
  },
];

export default function App() {
  // Global React state
  const [activeTab, setActiveTab] = useState<string>("dash");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<DailyStats>(DEFAULT_STATS);
  const [logs, setLogs] = useState<ActivityLog[]>(DEFAULT_LOGS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  
  // Interactive details modal state
  const [selectedWorkoutDetail, setSelectedWorkoutDetail] = useState<ActivityLog | null>(null);

  // Active theme calculations
  const activeThemeId = profile.themeId || "cyber-pulse";
  const customThemes = profile.customThemes || [];
  const allThemes = [...PREDEFINED_THEMES, ...customThemes];
  const activeTheme = allThemes.find((t) => t.id === activeThemeId) || PREDEFINED_THEMES[0];

  useEffect(() => {
    if (!activeTheme) return;
    const root = document.documentElement;
    root.style.setProperty("--theme-bg", activeTheme.bg);
    root.style.setProperty("--theme-text", activeTheme.text);
    root.style.setProperty("--theme-text-muted", activeTheme.textMuted);
    root.style.setProperty("--theme-accent", activeTheme.accent);
    root.style.setProperty("--theme-accent-hover", activeTheme.accentHover);
    root.style.setProperty("--theme-accent-rgb", hexToRgb(activeTheme.accent));
    
    if (activeTheme.isDark) {
      root.style.setProperty("--theme-glass-bg", "rgba(255, 255, 255, 0.08)");
      root.style.setProperty("--theme-glass-border", "rgba(255, 255, 255, 0.12)");
      root.style.setProperty("--orb-opacity", "0.25");
    } else {
      root.style.setProperty("--theme-glass-bg", "rgba(15, 23, 42, 0.05)");
      root.style.setProperty("--theme-glass-border", "rgba(15, 23, 42, 0.1)");
      root.style.setProperty("--orb-opacity", "0.15");
    }

    // Set font family configurations
    root.style.setProperty("--custom-font-sans", activeTheme.fontSans);
    root.style.setProperty("--custom-font-mono", activeTheme.fontMono);
    root.style.setProperty("--orb-1-color", activeTheme.orb1);
    root.style.setProperty("--orb-2-color", activeTheme.orb2);
    root.style.setProperty("--orb-3-color", activeTheme.orb3);
  }, [activeTheme]);

  // Load state from localStorage on init
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("pulse_user_profile");
      const savedStats = localStorage.getItem("pulse_daily_stats");
      const savedLogs = localStorage.getItem("pulse_activity_logs");
      const savedAchievements = localStorage.getItem("pulse_achievements");

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    } catch (e) {
      console.error("Local storage sync error on startup:", e);
    }
  }, []);

  // Sync state helpers to update React and localStorage safely
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("pulse_user_profile", JSON.stringify(next));
      return next;
    });
  };

  const updateStats = (updated: Partial<DailyStats>) => {
    setStats((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("pulse_daily_stats", JSON.stringify(next));
      return next;
    });
  };

  // Safe increment steps action callback
  const handleIncrementSteps = (amount: number) => {
    const nextSteps = stats.steps + amount;
    // Calories proportional increment: roughly 0.04 kcal per step
    const nextCalories = stats.calories + Math.round(amount * 0.045);
    // Active minutes increment slightly
    const nextMins = stats.activeMinutes + Math.round(amount / 400);

    updateStats({
      steps: nextSteps,
      calories: nextCalories,
      activeMinutes: nextMins,
    });
  };

  // Workout completed increment stats logic
  const handleWorkoutComplete = (minutes: number, calories: number, steps: number) => {
    updateStats({
      activeMinutes: stats.activeMinutes + minutes,
      calories: stats.calories + calories,
      steps: stats.steps + steps,
    });
  };

  // Add custom workout log item
  const handleAddActivity = (newLog: Omit<ActivityLog, "id">) => {
    setLogs((prev) => {
      const fullLog: ActivityLog = {
        id: `act-${Date.now()}`,
        ...newLog,
      };
      const next = [fullLog, ...prev];
      localStorage.setItem("pulse_activity_logs", JSON.stringify(next));
      return next;
    });
  };

  // Reset demo triggers
  const handleResetData = () => {
    localStorage.removeItem("pulse_user_profile");
    localStorage.removeItem("pulse_daily_stats");
    localStorage.removeItem("pulse_activity_logs");
    localStorage.removeItem("pulse_achievements");
    
    setProfile(DEFAULT_PROFILE);
    setStats(DEFAULT_STATS);
    setLogs(DEFAULT_LOGS);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setActiveTab("dash");
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col antialiased relative overflow-hidden`} style={{ backgroundColor: "var(--theme-bg)" }}>
      
      {/* Background Glow Orbs for the Frosted Glass theme */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* FIXED TOP APP BAR SCROLS */}
      <header className="fixed top-0 w-full z-40 glass px-5 flex justify-between items-center h-16 shadow-lg">
        <button
          onClick={() => setActiveTab("profile")}
          className="hover:opacity-80 transition-opacity active:scale-95 duration-100 p-1 text-blue-400"
          aria-label="App Menu Settings"
          id="btn-app-bolt-header"
        >
          <span className="material-symbols-outlined text-[26px]">bolt</span>
        </button>
        
        <h1
          onClick={() => setActiveTab("dash")}
          className="font-sans text-2xl font-black italic tracking-tighter text-white select-none cursor-pointer flex items-center"
          id="logo-pulse-main"
        >
          PULSE<span className="text-blue-400">.</span>
        </h1>

        <button
          onClick={() => setActiveTab("profile")}
          className="w-8 h-8 rounded-full overflow-hidden border border-[#2a2a2a]/50 hover:opacity-85 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Aides profile view"
          id="btn-profile-avatar-header"
        >
          <img
            alt="User profile pointer avatar"
            className="w-full h-full object-cover"
            src={profile.avatarUrl}
          />
        </button>
      </header>

      {/* CORE PAGE SECTIONS CONTAINER */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-20 pb-28 relative z-10 flex flex-col justify-start">
        {activeTab === "dash" && (
          <Dash
            userProfile={profile}
            dailyStats={stats}
            onStartWorkout={() => setActiveTab("track")}
            onIncrementSteps={handleIncrementSteps}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "track" && (
          <Track
            onAddActivity={handleAddActivity}
            onTabChange={setActiveTab}
            onWorkoutComplete={handleWorkoutComplete}
          />
        )}

        {activeTab === "stats" && (
          <Stats
            logs={logs}
            achievements={achievements}
            onSelectWorkout={(workout) => setSelectedWorkoutDetail(workout)}
          />
        )}

        {activeTab === "pro" && (
          <Pro userProfile={profile} onChangeProfile={updateProfile} />
        )}

        {activeTab === "profile" && (
          <Profile
            userProfile={profile}
            onChangeProfile={updateProfile}
            onResetData={handleResetData}
            onTabChange={setActiveTab}
          />
        )}
      </main>

      {/* WORKOUT DRILL DOWN DETAIL MODAL SLIDE UP */}
      {selectedWorkoutDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-5 animate-fade-in">
          <div className="glass w-full max-w-xs rounded-3xl p-5 shadow-2xl relative">
            <h4 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              Workout Summary
            </h4>
            <div className="my-3 text-white">
              <div className="text-xl font-bold tracking-tight mb-2">
                {selectedWorkoutDetail.title}
              </div>
              <p className="text-xs text-slate-400 mb-1">
                Completed {selectedWorkoutDetail.date}
              </p>
              <div className="flex gap-4 mt-3 py-2 border-t border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Duration
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {selectedWorkoutDetail.durationMinutes} mins
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Yield Metric
                  </div>
                  <div className="text-sm font-semibold text-blue-400">
                    {selectedWorkoutDetail.metricValue}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedWorkoutDetail(null)}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
              id="btn-close-summary-modal"
            >
              OK, Awesome!
            </button>
          </div>
        </div>
      )}

      {/* PERSISTENT BOTTOM TAB NAVIGATION */}
      <nav className="fixed bottom-0 w-full z-40 glass shadow-2xl" id="nav-tabs-bottom">
        <div className="max-w-md mx-auto flex justify-around items-center h-20 pb-4 px-3">
          
          {/* Tab 1: Dash */}
          <button
            onClick={() => setActiveTab("dash")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "dash" ? "text-blue-400 scale-102" : "text-slate-400 hover:text-white"
            }`}
            id="tab-dash-nav"
          >
            <span className={`material-symbols-outlined text-[24px] mb-1 ${activeTab === "dash" ? "fill-current" : ""}`}>
              dashboard
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Dash</span>
          </button>

          {/* Tab 2: Track Run */}
          <button
            onClick={() => setActiveTab("track")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "track" ? "text-blue-400 scale-102" : "text-slate-400 hover:text-white"
            }`}
            id="tab-track-nav"
          >
            <span className={`material-symbols-outlined text-[24px] mb-1 ${activeTab === "track" ? "fill-current" : ""}`}>
              bolt
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Track</span>
          </button>

          {/* Tab 3: Insights Stats */}
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "stats" ? "text-blue-400 scale-102" : "text-slate-400 hover:text-white"
            }`}
            id="tab-stats-nav"
          >
            <span className={`material-symbols-outlined text-[24px] mb-1 ${activeTab === "stats" ? "fill-current" : ""}`}>
              insights
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Stats</span>
          </button>

          {/* Tab 4: Subscription/Coach */}
          <button
            onClick={() => setActiveTab("pro")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "pro"
                ? "text-blue-400 scale-102"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-pro-nav"
          >
            <span
              className={`material-symbols-outlined text-[24px] mb-1 ${
                activeTab === "pro" ? "fill-current font-bold text-blue-400/90" : ""
              }`}
            >
              workspace_premium
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
              Pro Coach
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}
