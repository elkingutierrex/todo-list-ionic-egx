import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskRepository } from '../repositories/task.repository';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;
  let mockRepo: any;
  let mockAuth: any;

  beforeEach(() => {
    mockRepo = {
      getTasks: vi.fn().mockReturnValue(of([])),
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn()
    };

    mockAuth = {
      currentUser: vi.fn().mockReturnValue({ id: 'user123' })
    };

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useValue: mockRepo },
        { provide: AuthService, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial empty tasks', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('should clear state', () => {
    // Manually trigger a change if needed, but clearState should reset it
    service.clearState();
    expect(service.tasks()).toEqual([]);
    expect(service.selectedCategoryId()).toBeNull();
  });
});
