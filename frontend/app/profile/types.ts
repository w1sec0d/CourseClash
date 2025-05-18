import { AchievementProps } from '../curso/types';

export interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  completedCourses: number;
  enrolledCourses: number;
  achievements: AchievementProps[];
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
    customizationItems: {
      id: string;
      name: string;
      type: 'avatar' | 'theme' | 'badge';
      price: number;
      unlocked: boolean;
      preview: string;
    }[];
  };
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
