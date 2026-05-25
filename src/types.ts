export interface ThemeConfig {
  id: string;
  name: string;
  isDark: boolean;
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  orb1: string;
  orb2: string;
  orb3: string;
  fontSans: string;
  fontMono: string;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  location: string;
  avatarUrl: string;
  age: number;
  weight: number; // in lbs
  height: string; // e.g. "6'1\""
  dailyStepsGoal: number;
  weeklyWorkoutsGoal: number;
  darkMode: boolean;
  pushNotifications: boolean;
  units: "IMPERIAL" | "METRIC";
  isPro: boolean;
  themeId?: string; // ID of active theme
  customThemes?: ThemeConfig[]; // user personalized custom themes
}

export interface DailyStats {
  steps: number;
  calories: number;
  heartRate: number;
  activeMinutes: number;
}

export interface ActivityLog {
  id: string;
  title: string;
  type: "run" | "gym" | "swim";
  date: string; // e.g. "TODAY", "YESTERDAY"
  durationMinutes: number;
  metricValue: string; // e.g. "5.2 mi", "420 cal", "1,500 m"
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  earned: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  content: string;
  timestamp: string;
}
