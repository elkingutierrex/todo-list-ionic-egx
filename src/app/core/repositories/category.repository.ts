import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

export abstract class CategoryRepository {
  abstract getCategories(): Observable<Category[]>;
  abstract addCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category>;
  abstract updateCategory(category: Category): Observable<Category>;
  abstract deleteCategory(id: string): Observable<void>;
}
