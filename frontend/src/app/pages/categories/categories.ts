import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { CategoriesFacade } from '../../core/facades/categories-facade';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  private readonly authService = inject(AuthService);
  private readonly categoriesFacade = inject(CategoriesFacade);

  readonly categories = this.categoriesFacade.categories;
  readonly selectedId = this.categoriesFacade.selectedId;
  readonly isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.categoriesFacade.loadCategories();
      } else {
        this.categoriesFacade.clear();
      }
    });
  }

  onSelected(id: number): void {
    this.categoriesFacade.openView(id);
  }

  openSidebarForCreating(): void {
    this.categoriesFacade.openCreate();
  }

  openSidebarForView(id: number | undefined): void {
    if (id === undefined) {
      this.categoriesFacade.closeSidebar();
      return;
    }

    this.categoriesFacade.openView(id);
  }
}
