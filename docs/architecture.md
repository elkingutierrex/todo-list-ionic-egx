# Architecture

## Architecture Overview

Clean Architecture with 4 concentric layers:

```
Presentation Layer  →  Core/Application Layer  →  Domain  ←  Infrastructure Layer
(Components)            (Services, Use Cases)     (Models)    (Repos, Firebase, Mock)
```

Dependencies always point **inward** (toward Domain). Infrastructure never imports Presentation.

## Folder Structure

```
src/app/
├── core/
│   ├── guards/              auth.guard.ts
│   ├── models/              task.model.ts, category.model.ts, feature-flag.model.ts, user.model.ts
│   ├── repositories/        task.repository.ts, category.repository.ts, feature-flag.repository.ts
│   └── services/            task.service.ts, category.service.ts, feature-flag.service.ts
├── data/
│   └── infrastructure/
│       ├── mock-task.repository.ts
│       ├── mock-category.repository.ts
│       ├── mock-feature-flag.repository.ts
│       ├── firebase-task.repository.ts
│       ├── firebase-category.repository.ts
│       └── firebase-feature-flag.repository.ts
├── presentation/
│   ├── features/
│   │   ├── auth/login/
│   │   ├── tasks/
│   │   │   ├── task-list/           Smart component
│   │   │   └── task-item/           Dumb component
│   │   └── categories/
│   │       ├── category-list/       Smart component
│   │       └── category-form/       Dumb component
│   └── shared/
│       ├── components/
│       └── pipes/
└── shared/

docs/
capacitor.config.ts
```

## Data Flow

```
User Interaction
    ↓
Smart Component (page)
    → calls Service
        → calls Repository Port
            → [Mock | Firebase] Implementation
                → returns Observable<T> | Signal<T>
    ← Service stores in Signal
← Component reacts via computed/signal
```

## Domain Design

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  categoryId?: string;       // NEW: optional category assignment
  isCompleted: boolean;
  createdAt: Date;
  userId: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  color: string;             // hex color for badge
  userId: string;
  createdAt: Date;
}
```

## Services

| Service             | Responsibility                                  |
|---------------------|-------------------------------------------------|
| `TaskService`       | CRUD + filter by category via signals           |
| `CategoryService`   | CRUD categories via signals                     |
| `FeatureFlagService`| Reads Remote Config; exposes isEnabled(key)     |
| `AuthService`       | Auth state management                           |

## Firebase Integration

When `environment.useMocks = false`:
- `FirebaseTaskRepository` reads/writes `users/{uid}/tasks`
- `FirebaseCategoryRepository` reads/writes `users/{uid}/categories`
- `FirebaseFeatureFlagRepository` reads Remote Config key `categoryFeatureEnabled`

## Remote Config Integration

Feature flag `categoryFeatureEnabled`:
- `true` → Category management UI is visible
- `false` → All category-related UI is hidden from DOM

## Local Storage Strategy (Mock path)

- Tasks stored under key `tasks_v1`
- Categories stored under key `categories_v1`
- Cleared per logout (auth guard)
