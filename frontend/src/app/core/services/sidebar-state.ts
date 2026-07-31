import { Injectable, signal } from '@angular/core';

export type SidebarSelection =
  | { type: 'task'; mode: 'create' }
  | { type: 'task'; mode: 'view'; id: number }
  | { type: 'category'; mode: 'create' }
  | { type: 'category'; mode: 'view'; id: number }
  | null;

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  readonly selection = signal<SidebarSelection>(null);

  openTaskCreate(): void {
    this.selection.set({ type: 'task', mode: 'create' });
  }

  openTaskView(id: number): void {
    this.selection.set({ type: 'task', mode: 'view', id });
  }

  openCategoryCreate(): void {
    this.selection.set({ type: 'category', mode: 'create' });
  }

  openCategoryView(id: number): void {
    this.selection.set({ type: 'category', mode: 'view', id });
  }

  close(): void {
    this.selection.set(null);
  }
}