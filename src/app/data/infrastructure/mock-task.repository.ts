import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskRepository } from '../../core/repositories/task.repository';
import { Task } from '../../core/models/task.model';

const STORAGE_KEY = 'tasks_v1';

@Injectable({ providedIn: 'root' })
export class MockTaskRepository extends TaskRepository {
  private load(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return this.getDefaults();
    const parsed: Task[] = JSON.parse(raw);
    return parsed.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
  }

  private save(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  private getDefaults(): Task[] {
    const defaults: Task[] = [
      {
        id: 'task-1',
        title: 'Setup Angular project',
        description: 'Initialize Ionic + Angular with Clean Architecture',
        isCompleted: true,
        createdAt: new Date(Date.now() - 86400000),
        userId: 'mock-user',
      },
      {
        id: 'task-2',
        title: 'Implement categories',
        description: 'Add task categorization with CRUD and filtering',
        isCompleted: false,
        createdAt: new Date(),
        userId: 'mock-user',
      },
    ];
    this.save(defaults);
    return defaults;
  }

  getTasks(): Observable<Task[]> {
    return of(this.load());
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const tasks = this.load();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date(),
    };
    tasks.unshift(newTask);
    this.save(tasks);
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const tasks = this.load();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      this.save(tasks);
    }
    return of(task);
  }

  deleteTask(id: string): Observable<void> {
    const tasks = this.load().filter((t) => t.id !== id);
    this.save(tasks);
    return of(void 0);
  }
}
