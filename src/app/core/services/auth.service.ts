import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);

  currentUser = signal<User | null>(this.authRepository.getCurrentUser());

  constructor() { }

  findUser(email: string): Observable<User | null> {
    return this.authRepository.findUser(email);
  }

  createUser(email: string): Observable<User> {
    return this.authRepository.createUser(email).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  setCurrentUser(user: User): void {
    this.authRepository.setCurrentUser(user);
    this.currentUser.set(user);
  }

  logout(): void {
    this.authRepository.logout();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
