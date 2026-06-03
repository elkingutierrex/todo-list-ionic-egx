import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskRepository } from '../../core/repositories/task.repository';
import { Task } from '../../core/models/task.model';

@Injectable({
    providedIn: 'root'
})
export class MockTaskRepository extends TaskRepository {
    private tasks: Task[] = [
        {
            id: '1',
            title: 'Initial Task',
            description: 'This is a mock task',
            createdAt: new Date(),
            isCompleted: false,
            userId: '1'
        },
        {
            id: '2',
            title: 'Completed Task',
            description: 'Previously finished task',
            createdAt: new Date(Date.now() - 86400000), // Yesterday
            isCompleted: true,
            userId: '1'
        }
    ];

    getTasks(): Observable<Task[]> {
        // In a real app, we would filter by userId, but for mock we can just return all or filter by current user if we inject Auth
        return of(this.tasks);
    }

    addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
        const newTask: Task = {
            ...task,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date()
        };
        this.tasks.push(newTask);
        return of(newTask);
    }

    updateTask(task: Task): Observable<Task> {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            this.tasks[index] = task;
            return of(task);
        }
        return of(task); // Should ideally error if not found
    }

    deleteTask(id: string): Observable<void> {
        this.tasks = this.tasks.filter(t => t.id !== id);
        return of(void 0);
    }
}
