import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { TaskRepository } from '../repositories/task.repository';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private repo = inject(TaskRepository);
  private authService = inject(AuthService);

  private tasksSignal = signal<Task[]>([]);
  private selectedCategoryIdSignal = signal<string | null>(null);

  tasks = this.tasksSignal.asReadonly();
  selectedCategoryId = this.selectedCategoryIdSignal.asReadonly();

  filteredTasks = computed(() => {
    const categoryId = this.selectedCategoryIdSignal();
    const all = [...this.tasksSignal()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return categoryId ? all.filter((t) => t.categoryId === categoryId) : all;
  });

  pendingCount = computed(() => this.tasksSignal().filter((t) => !t.isCompleted).length);

  loadTasks(): void {
    this.repo.getTasks().subscribe((tasks) => this.tasksSignal.set(tasks));
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategoryIdSignal.set(categoryId);
  }

  addTask(partial: { title: string; description: string; categoryId?: string }) {
    const userId = this.authService.currentUser()?.id ?? 'anonymous';
    return this.repo.addTask({ ...partial, isCompleted: false, userId }).pipe(
      tap((newTask) => this.tasksSignal.update((tasks) => [newTask, ...tasks]))
    );
  }

  updateTask(task: Task) {
    return this.repo.updateTask(task).pipe(
      tap((updated) =>
        this.tasksSignal.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)))
      )
    );
  }

  deleteTask(id: string) {
    return this.repo.deleteTask(id).pipe(
      tap(() => this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id)))
    );
  }

  toggleTaskCompletion(task: Task) {
    return this.updateTask({ ...task, isCompleted: !task.isCompleted });
  }

  clearState(): void {
    this.tasksSignal.set([]);
    this.selectedCategoryIdSignal.set(null);
  }
}
