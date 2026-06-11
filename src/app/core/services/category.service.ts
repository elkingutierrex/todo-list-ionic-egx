import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { AuthService } from './auth.service';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private repo = inject(CategoryRepository);
  private authService = inject(AuthService);

  private categoriesSignal = signal<Category[]>([]);

  categories = this.categoriesSignal.asReadonly();

  categoryMap = computed(() =>
    new Map(this.categoriesSignal().map((c) => [c.id, c]))
  );

  loadCategories(): void {
    this.repo.getCategories().subscribe((cats) => this.categoriesSignal.set(cats));
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoryMap().get(id);
  }

  addCategory(partial: { name: string; color: string }) {
    const userId = this.authService.currentUser()?.id ?? 'anonymous';
    return this.repo.addCategory({ ...partial, userId }).pipe(
      tap((newCat) => this.categoriesSignal.update((cats) => [...cats, newCat]))
    );
  }

  updateCategory(category: Category) {
    return this.repo.updateCategory(category).pipe(
      tap((updated) =>
        this.categoriesSignal.update((cats) =>
          cats.map((c) => (c.id === updated.id ? updated : c))
        )
      )
    );
  }

  deleteCategory(id: string) {
    return this.repo.deleteCategory(id).pipe(
      tap(() => this.categoriesSignal.update((cats) => cats.filter((c) => c.id !== id)))
    );
  }

  clearState(): void {
    this.categoriesSignal.set([]);
  }
}
