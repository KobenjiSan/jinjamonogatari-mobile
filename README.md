# JinjaMonogatari Mobile ⛩️📱

JinjaMonogatari Mobile is a React Native (Expo) application for discovering Shinto shrines in Japan through a map-first interface and reading curated, citation-backed cultural context. It combines fast shrine browsing (map + list) with a structured detail experience (kami, history, folklore, gallery) and an etiquette guide designed for respectful visits.

---

## ✨ Overview

The mobile app is the public, read-focused client for JinjaMonogatari. It is built around a single primary flow: discover → preview → deep dive, optimized for mobile scanning and quick navigation while preserving research transparency through consistent attribution patterns (citations and image source overlays).

Related repositories:

API: https://github.com/KobenjiSan/jinjamonogatari-api
CMS: https://github.com/KobenjiSan/jinjamonogatari-cms

## 🧠 Problem & Motivation

Most shrine experiences are reduced to a pin on a map, with little accessible context for meaning, etiquette, or cultural background. This app bridges that gap by pairing location-based discovery with structured, sourced content and a dedicated etiquette guide so users can explore respectfully, not just navigate.

## 🏗 Architecture

The app is organized to keep screens thin, isolate data access, and prevent UI components from owning network/state complexity.

### Architecture overview

- **Expo Router navigation** (`/app`)
  - Tab-based primary navigation (`(tabs)`)
  - Auth routes isolated behind an auth group (`(auth)`)
  - Dynamic shrine routing via slug (`/shrine/[slug].tsx`)
- **Feature modules** (`/src/features`)
  - Each feature owns its UI, API client(s), mappers, hooks, and local state
  - Shrine detail content is split by tab (meta, kami, history, folklore, gallery) to keep files small and responsibilities clear
- **Shared layer** (`/src/shared`)
  - Reusable UI primitives (e.g., bookmark button, tag pill, search bar)
  - Gesture helpers and hooks
  - Tokenized styling system (`tokens.ts`, `text.ts`, `global.ts`) for consistent typography, spacing, and surfaces
  - Theme definitions + a single theme hook (`/src/theme`)
- **Core services** (`/src/core`)
  - API base client wiring
  - Auth/session handling (token storage, unauthorized events, and session boundary behavior)

### Major components

- **Map module**
  - Map is rendered via a dedicated `mapView` layer with an HTML template + bridge, enabling a high-performance, interactive map surface while keeping React Native UI responsive.
  - Marker rendering, selected-marker state, and preview hydration are handled via feature-specific hooks and mappers.
- **Shrine detail (bottom sheet)**
  - Shrine content is presented in a bottom sheet with tab navigation to reduce screen switching and keep discovery context close.
  - Each tab owns its own data loading/mapping and UI components.
- **Citations + attribution**
  - Citations are treated as first-class display elements across the app with reusable components, keeping behavior consistent and reducing duplication.
- **Auth + collections**
  - The app supports authenticated sessions with refresh-token rotation (handled at the client boundary), and a saved-shrines collection that is synchronized through a global cached IDs store to keep bookmark UI consistent across screens.

### Key technical decisions

- **Feature-first module layout**: keeps onboarding straightforward and makes it easy to evolve one surface (map, shrines, etiquette) without touching unrelated parts.
- **Mappers as a boundary**: API/fixture payloads are mapped into UI models in one place to prevent “shape drift” across components and reduce coupling.
- **Global style tokens + themes**: avoids per-screen style forks, supports a consistent visual system, and makes theme expansion a data problem instead of a refactor.

## 🚀 Features

- Map-based shrine discovery with marker previews
- Shrine browsing via list view with search input
- Shrine detail experience with structured sections:
  - Overview/meta
  - Kami
  - History
  - Folklore
  - Gallery
- Consistent attribution UI:
  - Citation blocks and citation items with external-link support
  - Image citation overlays for gallery and content imagery
- Etiquette guide:
  - At-a-glance cards with icon support
  - Accordion-based long-form guidance with ordered steps and citations
  - Highlighted key practices
- Saved shrines (authenticated):
  - Save/unsave from cards, previews, and header
  - Collection screen with synced bookmark state
- Location-aware UX:
  - Dynamic distance display
  - User location modes (including testing-oriented configurations)
- Directions:
  - One-tap open in external maps using user + shrine coordinates
  - UI processing state to confirm slow operations registered
- Theme selection via profile (multiple theme definitions)

## 🛠 Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- Expo Router

### Maps
- MapLibre GL JS (rendered via a dedicated map view layer)
- Custom markers and selected-state rendering

### UI / UX
- Gorhom Bottom Sheet
- Token-based styling system (typography, spacing, radius)
- Animated press interactions (press-scale)

### Data / Networking
- Fetch-based API clients
- Feature-level hooks for data loading
- Mapper layer for API → UI models

### Auth / Security
- JWT session handling
- Refresh-token rotation support
- Secure token storage + unauthorized event boundary

### Tools
- ESLint / TypeScript tooling (project defaults)
- Expo dev tooling

## 📸 Screenshots / Demo

> Screenshots coming soon.

## ⚙️ Local Development

### Prerequisites

- Node.js (LTS)
- npm
- Expo CLI tooling (via `npx`)
- iOS Simulator (macOS) and/or Android Studio emulator
- Expo Go (optional for device testing)

### Setup

1) Clone

```bash
git clone https://github.com/KobenjiSan/jinjamonogatari-mobile.git
cd jinjamonogatari-mobile
```

2) Install dependencies

```bash
npm install
```

3) Configure environment

Create a `.env.local` file at the repo root:

```bash
EXPO_PUBLIC_API_BASE=http://<YOUR_API_HOST>:<PORT>
```

Notes:
- `EXPO_PUBLIC_API_BASE` should point to the JinjaMonogatari API (see API repo for setup).
- For real-device testing, use a reachable IP (not `localhost`).

4) Run

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan the QR code with Expo Go (device)

## 🔐 Authentication / Security

- Authentication uses token-based sessions (JWT) with refresh-token support.
- Token storage is centralized in the auth layer; UI surfaces rely on the auth provider for session state.
- Unauthorized responses are handled through a single boundary so session expiry results in a predictable UI outcome (e.g., protected screens gated behind auth).

## 🧩 Key Engineering Decisions

- **Map rendering via a dedicated map view layer**: isolates map performance concerns from the rest of the UI and makes marker behavior deterministic across interactions.
- **Shrine detail as a bottom-sheet workspace**: keeps discovery context (map/list) close while enabling deep, multi-section reading without aggressive navigation stacking.
- **Reusable attribution components**: citations and image attribution are repeated across many surfaces; consolidating them prevents drift and keeps source display consistent.
- **Global saved-shrine IDs cache**: bookmark state must be consistent across map preview, list cards, shrine headers, and the collection screen. Loading once and broadcasting updates eliminates per-button polling and reduces stale UI.
- **Mapper-first data boundary**: DTO changes happen in one place. UI components deal with stable models, not raw payloads.

## 📈 Future Improvements

- App-wide loading/empty/error states standardized for every data surface
- Improved map search experience (beyond routing to list view)
- Reduce prop-drilling for location-dependent components (introduce a dedicated location context)
- Offline-friendly caching strategy for read-heavy content (etiquette + shrine detail)
- Deeper theme system consolidation (reduce token mismatches across themes)
- Performance profiling on older Android devices (map + bottom sheet interaction)

## 🧪 Testing

- Automated tests are not yet in place.
- Current verification is focused on integration testing through real-device sessions (auth refresh, saved-shrine sync, map interactions, and external navigation).

## 🚢 Deployment

- Deployment is not finalized for this repository.
- Intended path: Expo EAS build + distribution (internal testing → production), with the app consuming a deployed API base URL via environment configuration.

## 👤 Author

Samuel Keller  
B.S. Information Technology (Software Development + Digital Media) — Georgia Gwinnett College
