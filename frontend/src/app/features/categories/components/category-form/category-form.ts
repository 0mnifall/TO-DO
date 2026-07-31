import { Component, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../models/category';
import { CategoriesFacade } from '../../../../core/facades/categories-facade';
import { SidebarStateService } from '../../../../core/services/sidebar-state';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {
  private readonly categoriesFacade = inject(CategoriesFacade);
  private readonly sidebarState = inject(SidebarStateService);

  readonly selection = this.sidebarState.selection;
  readonly category = input<Category | undefined>(undefined);

  readonly categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    })
  });

  constructor() {
    effect(() => this.setUpForm());
  }

  setUpForm(): void {
    const selection = this.selection();

    if (selection?.type === 'category' && selection.mode === 'create') {
      this.categoryForm.reset({ name: '' });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const selection = this.selection();

    if (selection?.type === 'category' && selection.mode === 'create') {
      this.categoriesFacade.createCategory(this.categoryForm.getRawValue().name);
    }
  }

  deleteSelected(): void {
    const selection = this.selection();

    if (selection?.type === 'category' && selection.mode === 'view') {
      this.categoriesFacade.deleteCategory(selection.id);
    }
  }

  closeSidebar(): void {
    this.categoriesFacade.closeSidebar();
  }

  deleteFrom(taskId: number): void {
    this.categoriesFacade.removeTaskFromSelectedCategory(taskId);
  }
}
