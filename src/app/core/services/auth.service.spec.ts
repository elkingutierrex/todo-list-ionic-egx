import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { Router } from '@angular/router';
import { TaskService } from './task.service';
import { CategoryService } from './category.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepo: any;
  let mockRouter: any;
  let mockTaskService: any;
  let mockCategoryService: any;

  beforeEach(() => {
    mockRepo = {
      getCurrentUser: vi.fn().mockResolvedValue(null),
      logout: vi.fn().mockResolvedValue(undefined)
    };
    mockRouter = { navigate: vi.fn() };
    mockTaskService = { clearState: vi.fn() };
    mockCategoryService = { clearState: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockRepo },
        { provide: Router, useValue: mockRouter },
        { provide: TaskService, useValue: mockTaskService },
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should logout and clear all states', async () => {
    await service.logout();
    
    expect(mockRepo.logout).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
    expect(mockTaskService.clearState).toHaveBeenCalled();
    expect(mockCategoryService.clearState).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
