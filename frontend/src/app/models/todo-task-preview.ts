import { TaskPriority } from './task-priority';

export interface TodoTaskPreview {
  id: number;
  title: string;
  category: string | null;
  displayedDate: string;
  isCompleted: boolean;
  priority: TaskPriority;
}
