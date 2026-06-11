import { Injectable, signal, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { TaskService } from './task.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);
  private injector = inject(Injector);

  currentUser = signal<User | null>(null);

  constructor() {
    this.init();
  }

  private async init() {
    const user = await this.authRepository.getCurrentUser();
    this.currentUser.set(user);
  }

  findUser(email: string): Observable<User | null> {
    return this.authRepository.findUser(email);
  }

  createUser(email: string): Observable<User> {
    return this.authRepository.createUser(email).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  async setCurrentUser(user: User): Promise<void> {
    await this.authRepository.setCurrentUser(user);
    this.currentUser.set(user);
  }

  async logout(): Promise<void> {
    await this.authRepository.logout();
    this.currentUser.set(null);
    
    // Lazily get services to break circular dependency
    const taskService = this.injector.get(TaskService);
    const categoryService = this.injector.get(CategoryService);
    
    taskService.clearState();
    categoryService.clearState();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
