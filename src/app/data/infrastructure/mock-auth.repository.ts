import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, of, throwError } from 'rxjs';
import { AuthRepository } from '../../core/repositories/auth.repository';
import { User } from '../../core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class MockAuthRepository extends AuthRepository {
    private users: User[] = [
        { id: '1', email: 'test@example.com', role: 'USER' }, 
        { id: '2', email: 'admin@example.com', role: 'ADMIN' },
        { id: '3', email: 'user@example.com', role: 'USER' },
        { id: '4', email: 'guest@example.com', role: 'GUEST' }
    ];
    private currentUser: User | null = null;

    findUser(email: string): Observable<User | null> {
        const user = this.users.find(u => u.email === email);
        return of(user || null);
    }

    createUser(email: string): Observable<User> {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role: 'USER'
        };
        this.users.push(newUser);
        return of(newUser);
    }

    async setCurrentUser(user: User): Promise<void> {
        this.currentUser = user;
        await Preferences.set({ key: 'currentUser', value: JSON.stringify(user) });
    }

    async getCurrentUser(): Promise<User | null> {
        if (!this.currentUser) {
            const { value } = await Preferences.get({ key: 'currentUser' });
            if (value) {
                this.currentUser = JSON.parse(value);
            }
        }
        return this.currentUser;
    }

    async logout(): Promise<void> {
        this.currentUser = null;
        await Preferences.remove({ key: 'currentUser' });
    }
}
