import { Component, inject } from '@angular/core';
import { TaskForm } from '../../features/tasks/components/task-form/task-form';
import { CategoryForm } from '../../features/categories/components/category-form/category-form';
import { SidebarStateService } from '../../core/services/sidebar-state';
import { TasksFacade } from '../../core/facades/tasks-facade';
import { CategoriesFacade } from '../../core/facades/categories-facade';

@Component({
  selector: 'app-sidebar-outlet',
  imports: [TaskForm, CategoryForm],
  templateUrl: './sidebar-outlet.html',
  styleUrl: './sidebar-outlet.css'
})
export class SidebarOutlet {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly tasksFacade = inject(TasksFacade);
  private readonly categoriesFacade = inject(CategoriesFacade);

  readonly selection = this.sidebarState.selection;
  readonly selectedTask = this.tasksFacade.selectedTask;
  readonly selectedCategory = this.categoriesFacade.selectedCategory;
}
