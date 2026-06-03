import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AuthRepository } from '../../core/repositories/auth.repository';
import { User } from '../../core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class MockAuthRepository extends AuthRepository {
    private users: User[] = [
        { id: '1', email: 'test@example.com' } // Pre-seeded user
    ];
    private currentUser: User | null = null;

    findUser(email: string): Observable<User | null> {
        const user = this.users.find(u => u.email === email);
        return of(user || null);
    }

    createUser(email: string): Observable<User> {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email
        };
        this.users.push(newUser);
        return of(newUser);
    }

    setCurrentUser(user: User): void {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): User | null {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
}
