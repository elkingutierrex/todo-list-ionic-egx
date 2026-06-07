import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryRepository } from '../../core/repositories/category.repository';
import { Category } from '../../core/models/category.model';

const STORAGE_KEY = 'categories_v1';

@Injectable({ providedIn: 'root' })
export class MockCategoryRepository extends CategoryRepository {
  private load(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return this.getDefaults();
    const parsed: Category[] = JSON.parse(raw);
    return parsed.map((c) => ({ ...c, createdAt: new Date(c.createdAt) }));
  }

  private save(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }

  private getDefaults(): Category[] {
    const defaults: Category[] = [
      {
        id: 'cat-1',
        name: 'Work',
        color: '#5C6BC0',
        userId: 'mock-user',
        createdAt: new Date(),
      },
      {
        id: 'cat-2',
        name: 'Personal',
        color: '#66BB6A',
        userId: 'mock-user',
        createdAt: new Date(),
      },
      {
        id: 'cat-3',
        name: 'Learning',
        color: '#FFA726',
        userId: 'mock-user',
        createdAt: new Date(),
      },
    ];
    this.save(defaults);
    return defaults;
  }

  getCategories(): Observable<Category[]> {
    return of(this.load());
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
    const categories = this.load();
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date(),
    };
    categories.push(newCategory);
    this.save(categories);
    return of(newCategory);
  }

  updateCategory(category: Category): Observable<Category> {
    const categories = this.load();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      this.save(categories);
    }
    return of(category);
  }

  deleteCategory(id: string): Observable<void> {
    const categories = this.load().filter((c) => c.id !== id);
    this.save(categories);
    return of(void 0);
  }
}
