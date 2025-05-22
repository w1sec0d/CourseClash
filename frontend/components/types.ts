/**
 * Shared type definitions for CourseClash components
 */

export interface CourseItem {
  id: string;
  name: string;
  isFavorite?: boolean;
  progress: number;
  lastPlayed?: string;
  totalHours: number;
}
