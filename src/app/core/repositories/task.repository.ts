import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export abstract class TaskRepository {
    abstract getTasks(): Observable<Task[]>;
    abstract addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task>;
    abstract updateTask(task: Task): Observable<Task>;
    abstract deleteTask(id: string): Observable<void>;
}
