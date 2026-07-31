import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Categories } from './pages/categories/categories';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: Tasks,
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: Categories,
    pathMatch: 'full'
  }
];