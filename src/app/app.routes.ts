import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';



export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./presentation/features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./presentation/features/tasks/task-list/task-list').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
