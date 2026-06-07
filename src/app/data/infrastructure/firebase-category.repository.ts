import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { CategoryRepository } from '../../core/repositories/category.repository';
import { Category } from '../../core/models/category.model';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class FirebaseCategoryRepository extends CategoryRepository {
  private db = getFirestore(getApp());
  private readonly collectionName = 'categories';
  private authService = inject(AuthService);

  getCategories(): Observable<Category[]> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return from(Promise.resolve([]));

    const ref = collection(this.db, this.collectionName);
    const q = query(ref, where('userId', '==', userId));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => {
          const data = d.data();
          const createdAt =
            data['createdAt'] instanceof Timestamp
              ? data['createdAt'].toDate()
              : new Date(data['createdAt']);
          return { id: d.id, ...data, createdAt } as Category;
        })
      )
    );
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
    const ref = collection(this.db, this.collectionName);
    const payload = { ...category, createdAt: Timestamp.now() };
    return from(addDoc(ref, payload)).pipe(
      map((docRef) => ({ id: docRef.id, ...category, createdAt: payload.createdAt.toDate() }))
    );
  }

  updateCategory(category: Category): Observable<Category> {
    const { id, createdAt, ...updateData } = category;
    return from(updateDoc(doc(this.db, this.collectionName, id), updateData)).pipe(map(() => category));
  }

  deleteCategory(id: string): Observable<void> {
    return from(deleteDoc(doc(this.db, this.collectionName, id)));
  }
}
