import { TaskPriority } from './task-priority';

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  categoryId: number | null;
}

export type UpdateTaskDto = CreateTaskDto;
