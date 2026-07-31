import { TaskPriority } from './task-priority';

export interface TodoTask {
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
  priority: TaskPriority;
  categoryId: number | null;
  categoryName: string | null;
}
