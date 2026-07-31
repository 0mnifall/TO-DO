import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilter } from '../../models/task-filter';
import { CategoryPreview } from '../../models/category-preview';

@Component({
  selector: 'app-task-filters',
  imports: [FormsModule],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css'
})
export class TaskFilters {
  search = signal('');
  status = signal<boolean | null>(null);
  categoryId = signal<number | null>(null);

  categories = input.required<CategoryPreview[]>();

  filterChanged = output<TaskFilter>();

  setStatus(status: boolean | null): void {
    this.status.set(status);
    this.emitFilter();
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.emitFilter();
  }

  setCategory(categoryId: number | null): void {
    this.categoryId.set(categoryId);
    this.emitFilter();
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set(null);
    this.categoryId.set(null);

    this.emitFilter();
  }

  private emitFilter(): void {
    this.filterChanged.emit({
      search: this.search(),
      status: this.status(),
      categoryId: this.categoryId()
    });
  }
}