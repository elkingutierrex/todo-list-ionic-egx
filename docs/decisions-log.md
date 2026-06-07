# Decisions Log

## DEC-001

Date: 2026-06-07

Decision: Integrate Ionic into existing Angular 21 project rather than scaffold from scratch.

Reason: The codebase already contains domain models, repository abstractions (Task, Auth), Firebase and Mock implementations, and Clean Architecture folder structure. Rebuilding from scratch would waste existing quality work.

Alternatives:
- Option A: Re-scaffold entire project using `ionic start`
- Option B: Add Ionic packages to existing Angular project

Final Decision: **Option B** — Additive integration. Preserves existing code. Less risk.

---

## DEC-002

Date: 2026-06-07

Decision: Use `abstract class` (not TypeScript `interface`) for repository ports.

Reason: Angular's Dependency Injection system requires injection tokens. Abstract classes serve as both the type contract and the DI token simultaneously, avoiding the need for separate `InjectionToken<T>` declarations.

Alternatives:
- Option A: `interface` + `InjectionToken<T>`
- Option B: `abstract class` (self-token)

Final Decision: **Option B** — Simpler DI, less boilerplate.

---

## DEC-003

Date: 2026-06-07

Decision: Use Angular Signals for all synchronous reactive state; RxJS only for Firebase streams.

Reason: Signals have lower overhead than BehaviorSubjects for component rendering. Firebase returns Observables which are best converted to Signals at the service boundary via `toSignal()`.

Alternatives:
- Option A: Pure RxJS BehaviorSubject everywhere
- Option B: Signals + `toSignal()` at boundary

Final Decision: **Option B** — Better performance, simpler templates.

---

## DEC-004

Date: 2026-06-07

Decision: Persist Mock data in `localStorage` instead of in-memory arrays.

Reason: In-memory mocks reset on page refresh, making it unusable for manual testing. localStorage persists data across refreshes, simulating real persistence reliably.

Alternatives:
- Option A: In-memory arrays (current implementation)
- Option B: localStorage JSON serialization/deserialization

Final Decision: **Option B** — Aligns with assessment requirement for local storage persistence.

---

## DEC-005

Date: 2026-06-07

Decision: Category feature controlled by Firebase Remote Config flag `categoryFeatureEnabled`.

Reason: Assessment explicitly requires feature flags from Remote Config. Category management is the most significant new feature, making it the perfect candidate.

Alternatives:
- Option A: Hard-code categories as always-visible
- Option B: Guard category UI with Remote Config boolean flag

Final Decision: **Option B** — Meets assessment requirement and demonstrates Remote Config usage.

---

## DEC-006

Date: 2026-06-07

Decision: Consolidate all domain models into `src/app/core/models/`.

Reason: Having duplicate models or disjoint folders (`domain/models` and `core/models`) caused circular dependency potential and import path confusion in various services/directives after the Ionic migration. Centralizing them simplifies the architecture and fixes build visibility issues.

Final Decision: Centralized model strategy for better maintainability.

---

## DEC-007

Date: 2026-06-07

Decision: Increase initial bundle budgets to 1MB warning / 2MB error in `angular.json`.

Reason: The default budget of 500kB/1MB is too strict when including the full Ionic Framework bundle alongside Firebase SDKs. Increasing the budget allows for a successful production build without stripping essential framework functionality.

Final Decision: Adjusted budgets to accommodate framework overhead.
---

## DEC-008

Date: 2026-06-07

Final Decision: Native Ionic components are the preferred choice for all dialogs and notifications.

---

## DEC-009

Date: 2026-06-07

Decision: Standardized Modal Dimensions for Desktop using CSS overrides and removing sheet breakpoints.

Reason: Ionic sheet modals with breakpoints were causing the Task Form to stretch or collapse inconsistently on desktop browsers (rendering as a sliver or a full-width column). Standardizing dimensions to 600px width/550px height for desktop while maintaining responsive full-screen behavior for mobile ensures all input fields (Title, Description, Category) are always visible and accessible.

Final Decision: Desktop-specific CSS overrides for `.premium-modal` and removal of `initialBreakpoint` on large screens.
