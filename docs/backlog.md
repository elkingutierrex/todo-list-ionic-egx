# Backlog

## Features

- [ ] Push Notifications via Firebase Cloud Messaging
- [ ] Task due dates and reminders
- [ ] Subtasks
- [ ] Drag-and-drop task ordering
- [ ] Dark mode support
- [ ] Category color picker (native color input)

## Improvements

- [ ] Optimistic UI updates for task completion toggle
- [ ] Task search / keyword filtering
- [ ] Sort tasks by date, alphabetical, or category
- [x] Swipe-to-delete gesture (Ionic item-sliding)
- [x] Replace ngx-spinner with Ionic initial skeletons
- [ ] Add unit tests for all services
- [ ] Add E2E tests with Cypress / Playwright
- [ ] Replace Firebase stub repositories with real implementations once credentials are available
- [ ] Migrate `localStorage` to `@capacitor/preferences` for native persistence
- [ ] Implement Firebase Security Rules in Firestore
- [ ] Configure Remote Config parameters in Firebase Console
- [ ] Generate native assets (Icons/Splash) using `@capacitor/assets`

## Bugs

(None currently known)

## Refactors

- [ ] Merge `data/infrastructure` and `infrastructure` into single location
- [ ] Standardize error handling with a centralized ErrorHandlerService
