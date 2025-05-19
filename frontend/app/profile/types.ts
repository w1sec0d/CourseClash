export interface AchievementProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  courseId?: string;
  courseName?: string;
  unlocked?: boolean;
}

export interface CourseAchievement {
  courseName: string;
  achievements: AchievementProps[];
}

export interface CourseAchievement {
  courseName: string;
  achievements: AchievementProps[];
}

export interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  frame: string;
  bio: string;
  level: number;
  xp: number;
  completedCourses: number;
  enrolledCourses: number;
  achievements: CourseAchievement[];
  rank: number;
  totalStudents: number;
  trending: 'up' | 'down' | 'stable';
  stats: {
    completedTasks: number;
    totalTasks: number;
    coursesProgress: number;
    weeklyActivity: number;
  };
  currency: {
    balance: number;
    lastUpdated: string;
    nextReward: string;
    customizationItems: CustomizationItem[];
    activeTheme: string;
    activeFrame: string;
    activeBadge: string;
  };
}

export interface CustomizationItem {
  id: string;
  name: string;
  type: 'frame' | 'theme' | 'badge';
  price: number;
  unlocked: boolean;
  preview: string;
  frameStyle?: {
    color?: string;
    thickness?: number;
    pattern?: 'solid' | 'dashed' | 'dotted';
    glow?: boolean;
  };
}

export interface CurrencyActions {
  purchaseItem: (itemId: string) => Promise<void>;
  applyCustomization: (itemId: string) => void;
  getDailyReward: () => Promise<void>;
  canPurchase: (item: CustomizationItem) => boolean;
}

export interface ProfileStatsProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ProfileCourseProps {
  id: string;
  title: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'upcoming';
  xp: number;
  avatar: string;
  lastActivity: string;
}
