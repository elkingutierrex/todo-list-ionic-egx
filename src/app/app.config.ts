import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { TaskRepository } from './core/repositories/task.repository';
import { MockTaskRepository } from './data/infrastructure/mock-task.repository';
import { FirebaseTaskRepository } from './data/infrastructure/firebase-task.repository';

import { AuthRepository } from './core/repositories/auth.repository';
import { MockAuthRepository } from './data/infrastructure/mock-auth.repository';
import { FirebaseAuthRepository } from './data/infrastructure/firebase-auth.repository';

import { CategoryRepository } from './core/repositories/category.repository';
import { MockCategoryRepository } from './data/infrastructure/mock-category.repository';
import { FirebaseCategoryRepository } from './data/infrastructure/firebase-category.repository';

import { FeatureFlagRepository } from './core/repositories/feature-flag.repository';
import { MockFeatureFlagRepository } from './data/infrastructure/mock-feature-flag.repository';
import { FirebaseFeatureFlagRepository } from './data/infrastructure/firebase-feature-flag.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideIonicAngular({ mode: 'md' }),

    environment.useMock
      ? { provide: TaskRepository, useClass: MockTaskRepository }
      : { provide: TaskRepository, useClass: FirebaseTaskRepository },

    environment.useMock
      ? { provide: AuthRepository, useClass: MockAuthRepository }
      : { provide: AuthRepository, useClass: FirebaseAuthRepository },

    environment.useMock
      ? { provide: CategoryRepository, useClass: MockCategoryRepository }
      : { provide: CategoryRepository, useClass: FirebaseCategoryRepository },

    environment.useMock
      ? { provide: FeatureFlagRepository, useClass: MockFeatureFlagRepository }
      : { provide: FeatureFlagRepository, useClass: FirebaseFeatureFlagRepository },
  ],
};
