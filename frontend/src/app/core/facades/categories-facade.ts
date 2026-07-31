import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { CategoryService } from '../services/category';
import { TaskService } from '../services/task';
import { Category } from '../../models/category';
import { SidebarStateService } from '../services/sidebar-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, map, catchError, EMPTY, take } from 'rxjs';
import { CategoryOptionsState } from '../services/category-options-state';

@Injectable({
  providedIn: 'root'
})
export class CategoriesFacade {
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly sidebar = inject(SidebarStateService);
  private readonly categoryOptions = inject(CategoryOptionsState);
  private readonly destroyRef = inject(DestroyRef);

  private readonly selectedCategoryRequested$ = new Subject<number>();

  readonly categories = this.categoryOptions.categories;
  readonly selectedCategory = signal<Category | undefined>(undefined);
  readonly selectedId = signal<number | undefined>(undefined);

  constructor() {
    this.selectedCategoryRequested$
      .pipe(
        switchMap(id =>
          this.categoryService.getCategoryForView(id).pipe(
            map(category => ({ id, category })),
            catchError(() => EMPTY)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ id, category }) => {
        if (this.selectedId() === id) {
          this.selectedCategory.set(category);
        }
      });
  }

  loadCategories(): void {
    this.categoryOptions.loadCategories();
  }

  clear(): void {
    this.categoryOptions.clearCategories();
    this.selectedCategory.set(undefined);
    this.selectedId.set(undefined);
    this.sidebar.close();
  }

  openCreate(): void {
    this.selectedId.set(undefined);
    this.selectedCategory.set(undefined);
    this.sidebar.openCategoryCreate();
  }

  openView(id: number): void {
    this.selectedId.set(id);
    this.selectedCategory.set(undefined);
    this.sidebar.openCategoryView(id);
    this.selectedCategoryRequested$.next(id);
  }

  closeSidebar(): void {
    this.selectedId.set(undefined);
    this.selectedCategory.set(undefined);
    this.sidebar.close();
  }

  createCategory(name: string): void {
    this.categoryService
      .createCategory(name)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeSidebar();
        }
      });
  }

  deleteCategory(id: number): void {
    this.categoryService
      .deleteCategory(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeSidebar();
        }
      });
  }

  removeTaskFromSelectedCategory(taskId: number): void {
    const categoryId = this.selectedId();

    if (categoryId === undefined) {
      return;
    }

    this.taskService
      .clearCategory(taskId)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.selectedCategoryRequested$.next(categoryId)
      });
  }
}
