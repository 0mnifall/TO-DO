import { Component, effect, inject } from '@angular/core';
import { TaskList } from '../../shared/task-list/task-list';
import { TaskFilters } from '../../shared/task-filters/task-filters';
import { Pager } from '../../shared/pager/pager';
import { TaskFilter } from '../../models/task-filter';
import { TasksFacade } from '../../core/facades/tasks-facade';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-tasks',
  imports: [TaskList, TaskFilters, Pager],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  private readonly authService = inject(AuthService);
  private readonly tasksFacade = inject(TasksFacade);

  readonly tasks = this.tasksFacade.tasks;
  readonly categories = this.tasksFacade.categories;
  readonly selectedTask = this.tasksFacade.selectedTask;
  readonly selectedId = this.tasksFacade.selectedId;
  readonly totalCount = this.tasksFacade.totalCount;
  readonly totalPages = this.tasksFacade.totalPages;
  readonly page = this.tasksFacade.page;
  readonly filter = this.tasksFacade.filter;
  readonly hasActiveFilter = this.tasksFacade.hasActiveFilter;
  readonly isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.tasksFacade.loadTasks();
        this.tasksFacade.loadCategories();
      } else {
        this.tasksFacade.clear();
      }
    });
  }

  openSidebarForView(id: number | undefined): void {
    if (id === undefined) {
      this.tasksFacade.closeSidebar();
      return;
    }
    this.tasksFacade.openView(id);
  }

  openSidebarForCreating(): void {
    this.tasksFacade.openCreate();
  }

  changeStatus(taskId: number): void {
    this.tasksFacade.toggleCompleted(taskId);
  }

  onFilterChanged(filter: TaskFilter): void {
    this.tasksFacade.setFilter(filter);
  }

  onPageChanged(page: number): void {
    this.tasksFacade.setPage(page);
  }
}
