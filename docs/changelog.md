# Changelog

## v1.0.0 — 2026-06-07

### Added
- Angular 21 + Ionic Framework integration
- Clean Architecture folder structure (core, data, presentation, shared)
- Task domain model (id, title, description, categoryId, isCompleted, createdAt, userId)
- Category domain model (id, name, color, userId, createdAt)
- FeatureFlag domain model
- Abstract repository ports (TaskRepository, CategoryRepository, FeatureFlagRepository)
- MockTaskRepository with localStorage persistence
- MockCategoryRepository with localStorage persistence
- MockFeatureFlagRepository with categoryFeatureEnabled flag
- FirebaseTaskRepository (stub, requires Firebase config)
- FirebaseCategoryRepository (stub, requires Firebase config)
- FirebaseFeatureFlagRepository using Remote Config
- TaskService with Signals state management
- CategoryService with Signals state management
- FeatureFlagService
- Home/Tasks page (Ionic, Smart Component)
- Task item dumb component
- Category management page
- Category badge dumb component
- Task form modal (create/edit)
- Category form modal (create/edit)
- Task filtering by category
- GitFlow: main, develop, feature/categories, feature/tasks branches
- Capacitor Android and iOS configuration
- `/docs` documentation structure

### Fixed
- Build Fail: Fixed `super()` calls in derived repository classes.
- Build Fail: Fixed bundle budget limits in `angular.json` for Ionic components.
- Build Fail: Corrected `Role` model import paths across services and directives.
- UI: Migrated Login component to use Ionic components and centralized navigation to `/tasks`.
- Authentication: Fixed user creation logic to include default 'USER' role.
- UI: Removed SweetAlert2 and replaced with native Ionic Alert/Toast to fix overlapping and layout issues.
- Git: Tagged stable version as `v1.1.0`.

## v1.2.0 — 2026-06-07

### Added
- **Logo Integration**: New custom developer-centric logo for "elkingutierrex" integrated into Login and Header.
- **Premium UI Theme**: Modern Indigo/Slate design system with glassmorphism and card-based task list.
- **High Contrast Mode**: Unified typography with strict contrast ratios (Slate 800/900) for better accessibility.

### Fixed
- **Modal Stretching**: Redesigned Task Form Modal to use a stable fixed-size dialog on desktop (600x550px) and full-screen on mobile, preventing viewport stretching.
- **UI "Black Blocks"**: Fixed an issue where input fields were inheriting dark background styles, ensuring a clean and user-friendly appearance.
- **Task Creation**: Resolved final data handling issues in the task form.
- **Git History**: Consolidated legacy commits into a professional starting point, preserving today's step-by-step history.

## v1.4.0 — 2026-06-11 (Latest)

### Added
- **Vitest Testing Framework**: Configured Vitest as the primary unit testing engine for Angular 21, replacing deprecated Karma/Jasmine.
- **Secure Native Storage**: Integrated `@capacitor/preferences` to replace `localStorage`, ensuring user sessions are stored securely in native keychains.

### Fixed
- **Security (XSS)**: Corrected a critical vulnerability in the Login alert which was directly interpolating user input into HTML tags.
- **State Management (Sync Fix)**: Fixed a bug where logging out did not clear the internal Signal state, allowing previous session data to persist visually.
- **Infinite Loader**: Implemented RxJS `finalize()` operator in AuthService to guarantee the login/register loader is dismissed even on connection timeouts or silent failures.
- **Error Handling**: Added safe subscribe blocks with error notifications in Category management to replace previous "fire and forget" logic.

### Refactored
- **Code Organization**: Extracted inlined HTML and SCSS from `TaskFormModal` and `CategoryFormModal` into separate files for better maintainability and cleaner component logic.
- **Platform Experience**: Removed forced Material Design mode (`mode: 'md'`) to allow Ionic to serve native Cupertino visuals on iOS devices and standard Material on Android.
