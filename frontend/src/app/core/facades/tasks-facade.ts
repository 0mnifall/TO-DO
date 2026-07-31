import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, map, Subject, switchMap, take } from 'rxjs';
import { TaskService } from '../services/task';
import { TodoTask } from '../../models/todo-task';
import { TodoTaskPreview } from '../../models/todo-task-preview';
import { TaskFilter } from '../../models/task-filter';
import { SidebarStateService } from '../services/sidebar-state';
import { CreateTaskDto, UpdateTaskDto } from '../../models/task-dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryOptionsState } from '../services/category-options-state';

@Injectable({
  providedIn: 'root'
})
export class TasksFacade {
  private readonly taskService = inject(TaskService);
  private readonly sidebar = inject(SidebarStateService);
  private readonly categoryOptions = inject(CategoryOptionsState);
  private readonly destroyRef = inject(DestroyRef);

  private readonly loadTasksRequested$ = new Subject<void>();
  private readonly selectedTaskRequested$ = new Subject<number>();
  private taskListRequestId = 0;

  readonly tasks = signal<TodoTaskPreview[]>([]);
  readonly categories = this.categoryOptions.categories;
  readonly selectedTask = signal<TodoTask | undefined>(undefined);
  readonly selectedId = signal<number | undefined>(undefined);

  readonly totalCount = signal(0);
  readonly totalPages = signal(1);
  readonly page = signal(1);
  readonly pageSize = signal(5);
  readonly filter = signal<TaskFilter>({
    search: '',
    status: null,
    categoryId: null
  });
  readonly isLoading = signal(false);

  readonly hasActiveFilter = computed(() => {
    const filter = this.filter();
    return filter.search !== '' || filter.status !== null || filter.categoryId !== null;
  });

  constructor() {
    this.loadTasksRequested$
      .pipe(
        switchMap(() => {
          const requestId = ++this.taskListRequestId;
          const filter = this.filter();
          this.isLoading.set(true);

          return this.taskService
            .getTasks(this.page(), this.pageSize(), filter.search, filter.status, filter.categoryId)
            .pipe(
              catchError(() => EMPTY),
              finalize(() => {
                if (this.taskListRequestId === requestId) {
                  this.isLoading.set(false);
                }
              })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        this.tasks.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
      });

    this.selectedTaskRequested$
      .pipe(
        switchMap(id =>
          this.taskService.getTaskForView(id).pipe(
            map(task => ({ id, task })),
            catchError(() => EMPTY)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ id, task }) => {
        if (this.selectedId() === id) {
          this.selectedTask.set(task);
        }
      });
  }

  loadTasks(): void {
    this.loadTasksRequested$.next();
  }

  loadCategories(): void {
    this.categoryOptions.loadCategories();
  }

  clear(): void {
    this.tasks.set([]);
    this.totalCount.set(0);
    this.totalPages.set(1);
    this.selectedTask.set(undefined);
    this.selectedId.set(undefined);
    this.categoryOptions.clearCategories();
    this.sidebar.close();
  }

  setFilter(filter: TaskFilter): void {
    this.filter.set(filter);
    this.page.set(1);
    this.loadTasks();
  }

  setPage(page: number): void {
    this.page.set(page);
    this.loadTasks();
  }

  openCreate(): void {
    this.selectedId.set(undefined);
    this.selectedTask.set(undefined);
    this.sidebar.openTaskCreate();
  }

  openView(id: number): void {
    this.selectedId.set(id);
    this.selectedTask.set(undefined);
    this.sidebar.openTaskView(id);
    this.selectedTaskRequested$.next(id);
  }

  closeSidebar(): void {
    this.selectedId.set(undefined);
    this.selectedTask.set(undefined);
    this.sidebar.close();
  }

  createTask(dto: CreateTaskDto): void {
    this.taskService
      .createTask(dto)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTasks();
          this.closeSidebar();
        }
      });
  }

  updateTask(id: number, dto: UpdateTaskDto): void {
    this.taskService
      .updateTask(id, dto)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTasks();
          this.openView(id);
        }
      });
  }

  deleteTask(id: number): void {
    this.taskService
      .deleteTask(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTasks();
          this.closeSidebar();
        }
      });
  }

  toggleCompleted(id: number): void {
    const task = this.tasks().find(item => item.id === id);

    if (!task) {
      return;
    }

    const request = task.isCompleted
      ? this.taskService.reopenTask(id)
      : this.taskService.completeTask(id);

    request
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tasks.update(tasks =>
            tasks.map(item =>
              item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            )
          );
        }
      });
  }
}
