import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthRepository } from '../../core/repositories/auth.repository';
import { User } from '../../core/models/user.model';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthRepository extends AuthRepository {
    private db = getApps().length > 0 ? getFirestore(getApp()) : getFirestore(initializeApp(environment.firebase));
    private currentUser: User | null = null;
    private readonly collectionName = 'users';

    findUser(email: string): Observable<User | null> {
        const usersRef = collection(this.db, this.collectionName);
        const q = query(usersRef, where('email', '==', email));

        return from(getDocs(q)).pipe(
            map(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const doc = snapshot.docs[0];
                return { id: doc.id, ...doc.data() } as User;
            })
        );
    }

    createUser(email: string): Observable<User> {
        const usersRef = collection(this.db, this.collectionName);
        const newUser: Omit<User, 'id'> = { email, role: 'USER' };

        return from(addDoc(usersRef, newUser)).pipe(
            map(docRef => ({ id: docRef.id, ...newUser } as User))
        );
    }

    async setCurrentUser(user: User): Promise<void> {
        this.currentUser = user;
        await Preferences.set({
            key: 'currentUser',
            value: JSON.stringify(user)
        });
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
