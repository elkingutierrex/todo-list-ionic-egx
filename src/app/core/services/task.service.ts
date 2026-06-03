import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskRepository } from '../repositories/task.repository';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private repo = inject(TaskRepository);
  private authService = inject(AuthService);
  private tasksSignal = signal<Task[]>([]);

  tasks = this.tasksSignal.asReadonly();

  sortedTasks = computed(() => {
    return this.tasksSignal().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  loadTasks() {
    this.tasksSignal.set([]);
    this.repo.getTasks().subscribe(tasks => {
      this.tasksSignal.set(tasks);
    });
  }

  addTask(partialTask: { title: string, description: string }) {
    const userId = this.authService.currentUser()?.id || 'anonymous';
    const taskForRepo = {
      ...partialTask,
      isCompleted: false,
      userId
    };

    return this.repo.addTask(taskForRepo).pipe(
      tap(newTask => {
        this.tasksSignal.update(tasks => [newTask, ...tasks]);
      })
    );
  }

  updateTask(task: Task) {
    return this.repo.updateTask(task).pipe(
      tap(updatedTask => {
        this.tasksSignal.update(tasks => tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      })
    );
  }

  deleteTask(id: string) {
    return this.repo.deleteTask(id).pipe(
      tap(() => {
        this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
      })
    );
  }

  toggleTaskCompletion(task: Task) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    return this.updateTask(updatedTask);
  }
}
