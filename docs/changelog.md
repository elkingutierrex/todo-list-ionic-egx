# Changelog

## v1.14.3 — 2026-06-11 (Current)

### Added
- **Global Dark Mode**: Implemented a comprehensive high-contrast dark theme across all application surfaces using an Indigo/Slate color palette.
- **Premium Input System**: High-contrast input fields with deep dark backgrounds and white text for superior readability and modern aesthetics.
- **Dynamic Versioning**: Centralized version control via `app.constants.ts`, displayed prominently in all navigation bars and the login screen.
- **Technical Deliverables**: Created `EXAM_ANSWERS.md` documenting architecture, performance, and security decisions for the technical evaluation.

### Fixed
- **Circular Dependency (NG0200)**: Resolved a critical architectural loop between `AuthService` and repository layers using Angular `Injector` for lazy-loaded service resolution.
- **Logout Sequence**: Finalized the state purge mechanism to ensure all Signal-based data is cleared upon session termination.
- **Build Integrity**: Corrected multiple template syntax issues in the Login component introduced during UI refactoring.

## v1.4.0 — 2026-06-11

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

## v1.0.0 — 2026-06-07

### Added
- Angular 21 + Ionic Framework integration
- Clean Architecture folder structure (core, data, presentation, shared)
- Task domain model
- Category domain model
- Firebase integration and Remote Config feature flagging
- Task filtering by category
- Capacitor Android and iOS configuration
