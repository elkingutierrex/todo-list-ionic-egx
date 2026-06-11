# 🚀 TodoList Premium - elkingutierrex

[![Ionic Framework](https://img.shields.io/badge/Ionic-7.0-blue?logo=ionic)](https://ionicframework.com/)
[![Angular 21](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

A professional, high-performance task management application migrated to **Ionic Framework** with a focused **Clean Architecture** approach. This project features a stunning premium UI, high contrast accessibility, and a robust data persistence layer.

---

## ✨ Features

- 📱 **Ionic Hybrid App**: Fully responsive for Web, Android, and iOS.
- 💎 **Premium UI/UX**: Indigo/Slate design system with glassmorphism, cards, and smooth micro-animations.
- 🎯 **Clean Architecture**: Strict separation of concerns (Core, Data, Presentation).
- 🏷️ **Categorization**: Manage tasks with custom categories and color-coded labels.
- 🔍 **Smart Filtering**: Filter tasks by category with an intuitive horizontal chip-bar.
- 💾 **Persistence**: Dual repository support (Local Storage Mocks & Firebase Firestore stubs).
- 🚩 **Feature Flags**: Remote controlled functionality (Categories feature toggle).
- ♿ **High Contrast**: Optimized typography and color ratios for maximum readability.

---

## 🏗️ Architecture Stack

### Core Domain
- **Signals State Management**: High-performance reactive state using Angular Signals.
- **Repository Pattern**: Strict use of ports (abstract classes) to decouple domain logic from infrastructure.
- **Models**: Clean domain models for Tasks, Categories, and Feature Flags.

### Infrastructure
- **Data Repositories**: 
  - `MockTaskRepository`: Persistent local storage.
  - `FirebaseTaskRepository`: Production-ready Firestore integration (Stubs).
- **Control Documents**: Strategic mapping in `/docs` (Changelog, Decisions Log, Backlog).

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/elkingutierrex/todo-list-ionic-egx.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm run start
   ```

4. **Build for production**:
   ```bash
   npm run build:prod
   ```

---

## 📁 Project Structure

```text
src/app/
├── core/           # Domain Models, Repository Ports, Business Services
├── data/           # Concrete Repository Implementations (Mock/Firebase)
├── presentation/   # UI Components, Features, Pages, Shared Elements
│   └── features/   # Auth, Tasks, Categories
└── app.config.ts   # Dependency Injection Registry
```

---

## 📄 Documentation

Strategic control documents for project lifecycle:
- [Changelog](docs/changelog.md)
- [Decisions Log](docs/decisions-log.md)
- [Backlog](docs/backlog.md)
- [Architecture Overview](docs/architecture.md)
- [Respuestas a la Evaluación](docs/EXAM_ANSWERS.md)

---

## 📱 Hybrid Development (Android & iOS)

This project uses **Capacitor** (the modern successor to Cordova) for hybrid builds.

### Requirements:
- **Android**: Android Studio & Android SDK.
- **iOS**: Mac with Xcode (for `.ipa` generation).

### Compilation Steps:
1. **Sync web code to native projects**:
   ```bash
   npx cap sync
   ```
2. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
3. **Open in Xcode (macOS only)**:
   ```bash
   npx cap open ios
   ```
4. **Generate APK (from root)**:
   ```bash
   cd android && ./gradlew assembleDebug
   ```

> [!IMPORTANT]
> **Nota sobre Capacitor**: Esta aplicación utiliza **Capacitor** en lugar de Cordova. Capacitor es el sucesor oficial de Cordova mantenido por el equipo de Ionic, ofreciendo una integración más nativa, mejor rendimiento y compatibilidad total con Angular 21, cumpliendo con los estándares modernos de desarrollo mobile.

---

## 🚩 Remote Config & Feature Flags

A **Feature Flag** is implemented to control the visibility of the "Categories" management feature.

### Demo Instructions:
1. Go to the **Firebase Console** > **Remote Config**.
2. Add a parameter named `categoryFeatureEnabled`.
3. Set its value to `false`.
4. Publish changes.
5. **Result**: The Category filter chips and the "Manage Categories" button will disappear from the app UI.
6. Set to `true` to restore the functionality.

---

## ⚡ Performance Optimization

- **Lazy Loading**: All features (Auth, Tasks, Categories) are lazy-loaded via `loadComponent` in `app.routes.ts`.
- **Signals**: Used for granular change detection, minimizing DOM re-renders.
- **Event Coalescing**: Zone.js optimization enabled in `app.config.ts`.
- **Budgets**: Production bundle budgets optimized for framework overhead.

---

## 🌐 Live Demo & Binary
- **Hosting URL**: [https://egx-task-challenge.web.app](https://egx-task-challenge.web.app)
- **APK Path**: `android/app/build/outputs/apk/debug/app-debug.apk` (Generated after build)

---
