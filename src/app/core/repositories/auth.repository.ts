import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class AuthRepository {
    abstract findUser(email: string): Observable<User | null>;
    abstract createUser(email: string): Observable<User>;
    // For session management (simple version)
    abstract setCurrentUser(user: User): void;
    abstract getCurrentUser(): User | null;
    abstract logout(): void;
}
