import React, { useState } from "react";
import { UserProfile, ThemeConfig } from "../types";
import { PREDEFINED_THEMES } from "../App";

interface ProfileProps {
  userProfile: UserProfile;
  onChangeProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onTabChange?: (tab: string) => void;
}

export default function Profile({ userProfile, onChangeProfile, onResetData, onTabChange }: ProfileProps) {
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [editAge, setEditAge] = useState(userProfile.age);
  const [editWeight, setEditWeight] = useState(userProfile.weight);
  const [editHeight, setEditHeight] = useState(userProfile.height);
  
  const [editStepsGoal, setEditStepsGoal] = useState(userProfile.dailyStepsGoal);
  const [editWorkoutsGoal, setEditWorkoutsGoal] = useState(userProfile.weeklyWorkoutsGoal);

  // Local state for Theme Personalizer Creator
  const [customName, setCustomName] = useState("My Custom Style");
  const [customIsDark, setCustomIsDark] = useState(true);
  const [customBg, setCustomBg] = useState("#0f121d");
  const [customText, setCustomText] = useState("#f8fafc");
  const [customTextMuted, setCustomTextMuted] = useState("#94a3b8");
  const [customAccent, setCustomAccent] = useState("#3b82f6");
  const [customOrb1, setCustomOrb1] = useState("#3b82f6");
  const [customOrb2, setCustomOrb2] = useState("#a855f7");
  const [customOrb3, setCustomOrb3] = useState("#ec4899");
  const [customFontSans, setCustomFontSans] = useState("Inter");
  const [customFontMono, setCustomFontMono] = useState("JetBrains Mono");

  const customThemes = userProfile.customThemes || [];

  const handleSelectTheme = (themeId: string) => {
    onChangeProfile({ themeId });
  };

  const handleSaveCustomTheme = () => {
    if (!customName.trim()) return;
    
    const newTheme: ThemeConfig = {
      id: `custom-${Date.now()}`,
      name: customName,
      isDark: customIsDark,
      bg: customBg,
      text: customText,
      textMuted: customTextMuted,
      accent: customAccent,
      accentHover: customAccent,
      orb1: customOrb1,
      orb2: customOrb2,
      orb3: customOrb3,
      fontSans: customFontSans,
      fontMono: customFontMono,
      isCustom: true
    };

    const nextCustom = [...customThemes, newTheme];
    onChangeProfile({
      customThemes: nextCustom,
      themeId: newTheme.id
    });
    
    setCustomName("My Custom Style");
  };

  const handleDeleteCustomTheme = (themeIdToDelete: string) => {
    const nextCustom = customThemes.filter((t) => t.id !== themeIdToDelete);
    const updatedPayload: Partial<UserProfile> = {
      customThemes: nextCustom
    };
    
    if (userProfile.themeId === themeIdToDelete) {
      updatedPayload.themeId = "cyber-pulse";
    }

    onChangeProfile(updatedPayload);
  };

  const handleSaveMetrics = () => {
    onChangeProfile({
      age: Number(editAge) || 28,
      weight: Number(editWeight) || 175,
      height: editHeight || "6'1\"",
      dailyStepsGoal: Number(editStepsGoal) || 12000,
      weeklyWorkoutsGoal: Number(editWorkoutsGoal) || 5,
    });
    setIsEditingMetrics(false);
  };

  const toggleDarkMode = () => {
    onChangeProfile({ darkMode: !userProfile.darkMode });
  };

  const toggleNotifications = () => {
    onChangeProfile({ pushNotifications: !userProfile.pushNotifications });
  };

  const toggleUnits = () => {
    onChangeProfile({
      units: userProfile.units === "IMPERIAL" ? "METRIC" : "IMPERIAL",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10 relative z-10 w-full">
      {/* Profile Header Block */}
      <section className="flex flex-col items-center text-center gap-2 pt-2">
        <div className="relative inline-block mb-1">
          {/* Avatar frame */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)] flex items-center justify-center glass">
            <img
              alt="Alex Rivera"
              className="w-full h-full object-cover"
              src={userProfile.avatarUrl}
            />
          </div>
          {/* Pro badge overlap */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full shadow-[0_4px_10px_rgba(59,130,246,0.35)] whitespace-nowrap tracking-wide uppercase">
            {userProfile.isPro ? "PRO MEMBER" : "FREE ATHLETE"}
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-white mt-1.5">{userProfile.name}</h2>
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[15px] text-blue-400 fill-current">
            location_on
          </span>
          {userProfile.location}
        </p>
      </section>

      {/* Bento Layout Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Specs Stats Box */}
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <h3 className="text-sm font-semibold text-slate-300">Personal Stats</h3>
            {isEditingMetrics ? (
              <button
                onClick={handleSaveMetrics}
                className="text-xs font-mono font-bold text-blue-400 hover:text-white uppercase transition-colors cursor-pointer"
                id="btn-save-profile-metrics"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingMetrics(true)}
                className="text-blue-400 hover:text-white transition-colors cursor-pointer"
                id="btn-edit-profile-metrics"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            )}
          </div>

          {/* Dynamic Specs Form toggle state */}
          {isEditingMetrics ? (
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Age (Yrs)
                </label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="glass border border-white/10 rounded-xl text-white text-xs px-2 py-1.5 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Weight (Lbs)
                </label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(Number(e.target.value))}
                  className="glass border border-white/10 rounded-xl text-white text-xs px-2 py-1.5 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Height
                </label>
                <input
                  type="text"
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                  className="glass border border-white/10 rounded-xl text-white text-xs px-2 py-1.5 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 divide-x divide-white/5 py-1.5 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mb-1">
                  Weight
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">
                    {userProfile.weight}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-slate-400 font-semibold">LBS</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mb-1">
                  Height
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">
                    {userProfile.height}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mb-1">
                  Age
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">
                    {userProfile.age}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-slate-400 font-semibold">YRS</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Goals Configuration Card */}
        <div className="glass rounded-3xl p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-400 text-lg fill-current">
              flag
            </span>
            <h3 className="text-sm font-semibold text-slate-300">Goals</h3>
          </div>

          {/* Dynamic Goals Editor slider block */}
          {isEditingMetrics ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Daily Steps Goal
                </label>
                <input
                  type="number"
                  step="1000"
                  value={editStepsGoal}
                  onChange={(e) => setEditStepsGoal(Number(e.target.value))}
                  className="glass border border-white/10 rounded-xl text-white text-xs px-2 py-1.5 focus:border-[#3b82f6] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Weekly Workouts Goal
                </label>
                <input
                  type="number"
                  max="7"
                  value={editWorkoutsGoal}
                  onChange={(e) => setEditWorkoutsGoal(Number(e.target.value))}
                  className="glass border border-white/10 rounded-xl text-white text-xs px-2 py-1.5 focus:border-[#3b82f6] outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Steps Progress bar tracking */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-400 font-medium">Daily Steps</span>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {userProfile.dailyStepsGoal.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>

              {/* Weekly workouts progression indicators grids blocks */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-400 font-medium">Weekly Workouts</span>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {userProfile.weeklyWorkoutsGoal} Sessions
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: userProfile.weeklyWorkoutsGoal }).map((_, i) => {
                    const filled = i < 3; // mock completed sessions count (e.g. 3 done out of target)
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          filled ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global toggles panel App Settings */}
        <div className="glass rounded-3xl p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-400 text-lg">settings</span>
            <h3 className="text-sm font-semibold text-slate-300">App Settings</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Dark mode selector switch */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                aria-pressed={userProfile.darkMode}
                className={`w-11 h-6 rounded-full relative flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${
                  userProfile.darkMode ? "bg-blue-400" : "bg-white/10"
                }`}
                id="btn-toggle-darkmode"
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full shadow-sm transition-transform duration-200 ${
                    userProfile.darkMode ? "bg-slate-950 translate-x-4.5" : "bg-white translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Notification trigger toggles */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white font-medium">Push Notifications</span>
              <button
                onClick={toggleNotifications}
                aria-pressed={userProfile.pushNotifications}
                className={`w-11 h-6 rounded-full relative flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${
                  userProfile.pushNotifications ? "bg-blue-400" : "bg-white/10"
                }`}
                id="btn-toggle-notifications"
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full shadow-sm transition-transform duration-200 ${
                    userProfile.pushNotifications
                      ? "bg-slate-950 translate-x-4.5"
                      : "bg-white translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Units selection layout */}
            <div className="flex justify-between items-center pt-3.5 border-t border-white/5">
              <span className="text-xs text-white font-medium">Units</span>
              <button
                onClick={toggleUnits}
                className="flex items-center gap-1 font-mono text-[11px] font-bold text-blue-400 hover:text-white transition-colors cursor-pointer"
                id="btn-toggle-units"
              >
                {userProfile.units}
                <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* PERSONALIZATION THEMING AND PALETTE CREATOR */}
        <div className="glass rounded-3xl p-5 flex flex-col gap-5 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="material-symbols-outlined text-blue-400 text-xl">palette</span>
            <h3 className="text-sm font-semibold text-slate-300">Theming & Style Engine</h3>
          </div>

          {/* Select Predefined Themes */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-3 tracking-widest">
              Select Predefined Theme
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {PREDEFINED_THEMES.map((theme) => {
                const isSelected = userProfile.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {/* Ambient Background representation inside the tiny button preview */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div 
                        className="absolute w-12 h-12 rounded-full blur-md" 
                        style={{ background: theme.orb1, top: '-5px', right: '-5px' }} 
                      />
                      <div 
                        className="absolute w-10 h-10 rounded-full blur-md" 
                        style={{ background: theme.orb2, bottom: '-5px', left: '-5px' }} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-start w-full relative z-10">
                      <span className="text-xs font-bold text-white tracking-tight leading-none">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-blue-400 text-[14px] bg-blue-500/10 p-0.5 rounded-full">
                          check
                        </span>
                      )}
                    </div>

                    {/* Accent swatch previews */}
                    <div className="flex gap-1.5 mt-2 relative z-10 items-center">
                      <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: theme.bg }} title="Background" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} title="Accent" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.text }} title="Text" />
                      <span className="text-[9px] font-mono text-slate-400 truncate max-w-[50px]">
                        {theme.fontSans}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Themes List */}
          {customThemes.length > 0 && (
            <div>
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-3 tracking-widest">
                Your Custom Themes
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {customThemes.map((theme) => {
                  const isSelected = userProfile.themeId === theme.id;
                  return (
                    <div key={theme.id} className="relative group">
                      <button
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition-all duration-300 transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/10 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                            : "border-white/5 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full relative z-10 pr-6">
                          <span className="text-xs font-bold text-white tracking-tight truncate">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-blue-400 text-[14px] bg-blue-500/10 p-0.5 rounded-full">
                              check
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1.5 mt-2 relative z-10 items-center">
                          <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: theme.bg }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.text }} />
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[50px]">
                            {theme.fontSans}
                          </span>
                        </div>
                      </button>
                      
                      {/* Delete Custom Theme Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomTheme(theme.id);
                        }}
                        className="absolute top-2.5 right-2 px-1 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 active:scale-90 transition-all cursor-pointer z-20 rounded-md"
                        title="Delete Custom Theme"
                      >
                        <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Theme Creator Palette */}
          <div className="border-t border-white/5 pt-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-3 tracking-widest flex items-center justify-between">
              <span>Customize Colors & Fonts</span>
              <span className="text-blue-400">Personalizer</span>
            </h4>
            
            <div className="flex flex-col gap-4 bg-white/3 rounded-2xl p-4 border border-white/5">
              {/* Grid of details inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme Name input */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Custom Theme Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="glass border border-white/10 rounded-xl text-white text-xs px-3 py-2 outline-none focus:border-blue-500"
                    placeholder="e.g. Electric Ocean"
                  />
                </div>

                {/* Base luminosity dark vs light toggle */}
                <div className="flex flex-col gap-1 justify-center text-left">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Visual Base Type
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCustomIsDark(true);
                        setCustomBg("#0f121d");
                        setCustomText("#f8fafc");
                        setCustomTextMuted("#94a3b8");
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl border font-mono text-[9px] font-bold uppercase text-center cursor-pointer transition-all ${
                        customIsDark
                          ? "border-blue-500 bg-blue-500/15 text-blue-400"
                          : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        setCustomIsDark(false);
                        setCustomBg("#f8fafc");
                        setCustomText("#0f172a");
                        setCustomTextMuted("#64748b");
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl border font-mono text-[9px] font-bold uppercase text-center cursor-pointer transition-all ${
                        !customIsDark
                          ? "border-blue-500 bg-blue-500/15 text-blue-400"
                          : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>
              </div>

              {/* Font selectors row */}
              <div className="grid grid-cols-2 gap-3 border-t border-b border-white/5 py-3 my-1">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Primary UI Font
                  </label>
                  <select
                    value={customFontSans}
                    onChange={(e) => setCustomFontSans(e.target.value)}
                    className="glass border border-white/10 rounded-xl text-white text-xs px-3 py-2 bg-slate-900 outline-none cursor-pointer focus:border-blue-500"
                  >
                    <option value="Inter">Inter (Sans)</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="Outfit">Outfit (Sporty)</option>
                    <option value="Playfair Display">Playfair Display (Serif)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Mono Font
                  </label>
                  <select
                    value={customFontMono}
                    onChange={(e) => setCustomFontMono(e.target.value)}
                    className="glass border border-white/10 rounded-xl text-white text-xs px-3 py-2 bg-slate-900 outline-none cursor-pointer focus:border-blue-500"
                  >
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Fira Code">Fira Code</option>
                  </select>
                </div>
              </div>

              {/* Colors custom pickers palette grid */}
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-2.5">
                  Select Custom Colors
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {/* Accent Color picker */}
                  <div className="flex items-center gap-2 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => {
                        setCustomAccent(e.target.value);
                        setCustomOrb1(e.target.value);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none mb-1">Accent</span>
                      <span className="text-[9px] font-mono text-white/50">{customAccent}</span>
                    </div>
                  </div>

                  {/* Background selector */}
                  <div className="flex items-center gap-2 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none mb-1">Background</span>
                      <span className="text-[9px] font-mono text-white/50">{customBg}</span>
                    </div>
                  </div>

                  {/* Text Color picker */}
                  <div className="flex items-center gap-2 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none mb-1">Text</span>
                      <span className="text-[9px] font-mono text-white/50">{customText}</span>
                    </div>
                  </div>

                  {/* Muted Text Picker */}
                  <div className="flex items-center gap-2 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customTextMuted}
                      onChange={(e) => setCustomTextMuted(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none mb-1">Muted Text</span>
                      <span className="text-[9px] font-mono text-white/50">{customTextMuted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambient background light orbs styling options */}
              <div className="border-t border-white/5 pt-3 text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-2.5">
                  Ambient Glow Orbs Customization
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Orb 1 */}
                  <div className="flex flex-col items-center gap-1.5 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customOrb1}
                      onChange={(e) => setCustomOrb1(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[8px] font-mono text-slate-400 uppercase">Orb A</span>
                  </div>
                  {/* Orb 2 */}
                  <div className="flex flex-col items-center gap-1.5 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customOrb2}
                      onChange={(e) => setCustomOrb2(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[8px] font-mono text-slate-400 uppercase">Orb B</span>
                  </div>
                  {/* Orb 3 */}
                  <div className="flex flex-col items-center gap-1.5 border border-white/5 rounded-xl p-2 bg-white/3">
                    <input
                      type="color"
                      value={customOrb3}
                      onChange={(e) => setCustomOrb3(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[8px] font-mono text-slate-400 uppercase">Orb C</span>
                  </div>
                </div>
              </div>

              {/* Live Interactive Style preview element (Arena Card) */}
              <div className="border-t border-white/5 pt-3 mt-1 text-left">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-2.5">
                  Live Action Arena Preview
                </span>
                <div 
                  className="rounded-2xl p-4 border flex flex-col gap-3 relative overflow-hidden transition-all shadow-md"
                  style={{ 
                    backgroundColor: customBg, 
                    color: customText,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: `${customFontSans}, sans-serif`
                  }}
                >
                  {/* Minified layout background orbs */}
                  <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none opacity-20">
                    <div className="absolute w-12 h-12 rounded-full blur-md" style={{ background: customOrb1, top: '-10px', right: '-10px' }} />
                    <div className="absolute w-12 h-12 rounded-full blur-md" style={{ background: customOrb2, bottom: '-10px', left: '-10px' }} />
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    <h5 className="text-[11px] font-bold leading-none tracking-tight">Active Cardio</h5>
                    <span 
                      className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full" 
                      style={{ backgroundColor: `${customAccent}20`, color: customAccent }}
                    >
                      Pro Tracked
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-xl font-black leading-none">8,432</span>
                    <span className="text-[9px] font-mono uppercase" style={{ color: customTextMuted }}>Steps Today</span>
                  </div>

                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                    <div className="h-full rounded-full" style={{ backgroundColor: customAccent, width: '75%' }} />
                  </div>

                  <div className="flex justify-between text-[8px] font-mono relative z-10" style={{ color: customTextMuted }}>
                    <span>Target: 10k Steps</span>
                    <span style={{ color: customAccent }}>75% Completed</span>
                  </div>
                </div>
              </div>

              {/* CTA helper triggers */}
              <button
                onClick={handleSaveCustomTheme}
                className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-3 px-4 rounded-xl text-[10px] uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer text-white mt-1 border border-blue-400/10"
                id="btn-save-custom-theme"
              >
                Create & Save Theme Style
              </button>
            </div>
          </div>
        </div>

        {/* Global account parameters actions reset/restore */}
        <div className="md:col-span-2 flex flex-col gap-3.5 mt-2">
          {/* Pro Sub link helper */}
          <button
            onClick={() => onTabChange?.("pro")}
            className="w-full text-left glass border border-white/5 hover:border-blue-500/30 hover:bg-white/10 rounded-3xl p-4 flex items-center justify-between shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
            id="btn-manage-pro"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <span className="material-symbols-outlined text-lg fill-current">
                  workspace_premium
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Manage Pulse Pro</span>
                <span className="font-mono text-[9px] text-slate-400">
                  {userProfile.isPro ? "Active until Oct 2026" : "Unlock all premium coaching perks"}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
          </button>

          <button
            onClick={onResetData}
            className="w-full bg-transparent border border-pink-400/30 text-pink-400 hover:bg-pink-400/10 transition-colors rounded-2xl py-3 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            id="btn-signout-reset"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Reset Demo & Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
