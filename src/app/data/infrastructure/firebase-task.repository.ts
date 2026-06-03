import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { TaskRepository } from '../../core/repositories/task.repository';
import { Task } from '../../core/models/task.model';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseTaskRepository extends TaskRepository {
    private db = getApps().length > 0 ? getFirestore(getApp()) : getFirestore(initializeApp(environment.firebase));
    private readonly collectionName = 'tasks';
    private authService = inject(AuthService);

    getTasks(): Observable<Task[]> {
        const userId = this.authService.currentUser()?.id;
        if (!userId) return from(Promise.resolve([]));

        const tasksRef = collection(this.db, this.collectionName);
        const q = query(tasksRef, where('userId', '==', userId));

        return from(getDocs(q)).pipe(
            map(snapshot => {
                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore Timestamp to Date
                    const createdAt = data['createdAt'] instanceof Timestamp ? data['createdAt'].toDate() : new Date(data['createdAt']);
                    return { id: doc.id, ...data, createdAt } as Task;
                });
            })
        );
    }

    addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
        const tasksRef = collection(this.db, this.collectionName);
        const newTask = {
            ...task,
            createdAt: Timestamp.now()
        };

        return from(addDoc(tasksRef, newTask)).pipe(
            map(docRef => ({
                id: docRef.id,
                ...task,
                createdAt: newTask.createdAt.toDate()
            } as Task))
        );
    }

    updateTask(task: Task): Observable<Task> {
        const taskDoc = doc(this.db, this.collectionName, task.id);
        const { id, createdAt, ...updateData } = task; // Exclude ID and ideally createdAt from update unless needed

        return from(updateDoc(taskDoc, updateData)).pipe(
            map(() => task)
        );
    }

    deleteTask(id: string): Observable<void> {
        const taskDoc = doc(this.db, this.collectionName, id);
        return from(deleteDoc(taskDoc));
    }
}
