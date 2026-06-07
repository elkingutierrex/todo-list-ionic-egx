# Development Rules

## Framework Versions

| Technology       | Version         |
|------------------|-----------------|
| Angular          | 21.x            |
| Ionic            | Latest Stable   |
| TypeScript       | ~5.9 (strict)   |
| Capacitor        | Latest          |
| Firebase         | ^12.x           |
| RxJS             | ~7.8            |

## Architecture Rules

- Clean Architecture layers: Domain → Core (Ports) → Infrastructure → Presentation.
- Business logic must never depend on infrastructure implementations.
- Use `abstract class` for repositories (ports), not interfaces, for DI compatibility.
- Invert dependencies via Angular DI; choose implementation via `environment.useMocks`.

## Coding Standards

- TypeScript strict mode enabled at all times.
- No `any` types; use generics or specific types.
- All signals used for synchronous reactive state.
- RxJS for Firebase streams only.
- `ChangeDetectionStrategy.OnPush` on every component.
- `@for ... track` for all list rendering.

## Naming Conventions

| Element         | Convention                      | Example                     |
|-----------------|---------------------------------|-----------------------------|
| Files           | kebab-case                      | `task-item.component.ts`    |
| Interfaces      | PascalCase                      | `Task`, `Category`          |
| Services        | PascalCase + Service            | `TaskService`               |
| Repository port | PascalCase + Repository         | `TaskRepository`            |
| Components      | PascalCase + Component          | `TaskItemComponent`         |

## Folder Structure

```
src/app/
├── core/              # DI tokens, guards, interceptors
│   ├── guards/
│   ├── models/        # Domain models (Task, Category, FeatureFlag)
│   ├── repositories/  # Abstract ports
│   └── services/      # App-wide services
├── data/
│   └── infrastructure/ # Concrete repository implementations
├── features/          # Feature modules (notifications, etc.)
├── presentation/
│   ├── features/
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── categories/
│   └── shared/        # Reusable dumb components, pipes, directives
└── shared/
docs/
```

## GitFlow Rules

```
main       → Production releases
develop    → Integration branch
feature/*  → New features
release/*  → Release candidates
hotfix/*   → Critical production fixes
```

## Commit Conventions

```
feat(scope): description
fix(scope): description
perf(scope): description
refactor(scope): description
docs(scope): description
```

## Testing Strategy

- Unit tests for Services and Use Cases.
- Mock repositories injected in tests.
- Component tests with Angular Testing Library.

## Performance Strategy

- OnPush everywhere.
- Signals for state; computed signals for derived state.
- Virtual scrolling for task lists > 50 items.
- Lazy load all pages/routes.
- `@defer` for modal content.
