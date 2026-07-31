import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, Subject, switchMap } from 'rxjs';
import { CategoryPreview } from '../../models/category-preview';
import { CategoryService } from './category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CategoryOptionsState {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadRequested$ = new Subject<void>();

  private requestId = 0;

  readonly categories = signal<CategoryPreview[]>([]);
  readonly isLoading = signal(false);

  constructor() {
    this.loadRequested$
      .pipe(
        switchMap(() => {
          const requestId = ++this.requestId;
          this.isLoading.set(true);

          return this.categoryService.getCategories().pipe(
            catchError(() => EMPTY),
            finalize(() => {
              if (this.requestId === requestId) {
                this.isLoading.set(false);
              }
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(categories => this.categories.set(categories));
  }

  loadCategories(): void {
    this.loadRequested$.next();
  }

  clearCategories(): void {
    this.categories.set([]);
  }
}
