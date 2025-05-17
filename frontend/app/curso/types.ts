// Interfaces para el curso

export interface CourseContentProps {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'task' | 'forum';
  duration?: number;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  dueDate?: string;
  xpReward: number;
  hasChallenge?: boolean;
}

export interface ModuleProps {
  id: string;
  title: string;
  progress: number;
  content: CourseContentProps[];
  isExpanded: boolean;
}

export interface AnnouncementProps {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface ResourceProps {
  title: string;
  type: string;
  size?: string;
  count?: number;
}

export interface RankingProps {
  id: string;
  name: string;
  avatar: string;
  position: number;
  level: number;
  xp: number;
  completedTasks: number;
  totalTasks: number;
  achievements: number;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'stable';
}

