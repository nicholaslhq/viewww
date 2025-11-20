# Technical Requirements Document: Viewww

## 1. Introduction
**Viewww** is a web-based dashboard application that allows users to aggregate and view multiple external websites in real-time within a single, customizable interface. The application focuses on flexibility, allowing users to create, manage, and switch between different layout profiles tailored to specific workflows (e.g., financial analysis, news monitoring, development dashboards).

## 2. System Overview
- **Application Type**: Single Page Application (SPA).
- **Target Platform**: Modern Web Browsers (Chrome, Firefox, Edge, Safari).
- **Core Functionality**:
    - Multi-window iframe management.
    - Draggable and resizable grid layout.
    - Profile management (save/load layouts).
    - Source URL management.

## 3. User Interface & User Experience (UI/UX)
### 3.1. Dashboard Layout
- **Canvas**: An infinite or fixed-size grid canvas where windows reside.
- **Windows (Widgets)**:
    - **Header**: Contains the source title/URL, refresh button, close button, and a "drag handle".
    - **Content Area**: An `iframe` displaying the target URL.
    - **Controls**: Resize handles on edges/corners.
- **Sidebar/Toolbar** (Collapsible):
    - **Profile Selector**: Dropdown or list to switch profiles.
    - **Add Source**: Input field for URL and Name to add a new window.
    - **Profile Management**: Buttons to Save, Rename, Delete, or Create New Profile.
    - **Settings**: Global application settings (theme, grid snap size).

### 3.2. Interactions
- **Drag & Drop**: Users can click and drag window headers to reposition them on the grid.
- **Resizing**: Users can drag window edges to resize.
- **Profile Switching**: Instant transition between saved layouts without page reload.
- **Persistence**: Auto-save current state to local storage to prevent data loss on accidental refresh.

### 3.3. Visual Style
- **Theme**: Dark mode by default (preferred for dashboards), with high-contrast borders for active windows.
- **Aesthetics**: Glassmorphism effects for headers/overlays, smooth transitions for layout changes.

## 4. Functional Requirements
### 4.1. Window Management
- **FR-01**: System MUST allow users to add a new window by providing a valid URL.
- **FR-02**: System MUST allow users to remove a window.
- **FR-03**: System MUST support dragging windows to any position on the grid.
- **FR-04**: System MUST support resizing windows.
- **FR-05**: System SHOULD attempt to display the page title automatically (if accessible via proxy/CORS).

### 4.2. Profile Management
- **FR-06**: System MUST allow creating named profiles.
- **FR-07**: System MUST allow saving the current layout (window positions, sizes, URLs) to the active profile.
- **FR-08**: System MUST allow switching between profiles, restoring the associated layout immediately.
- **FR-09**: System MUST allow deleting and renaming profiles.
- **FR-10**: System MUST persist profiles across sessions (using LocalStorage).

### 4.3. Content Display
- **FR-11**: System MUST use `iframe` elements to embed content.
- **FR-12**: System MUST handle `X-Frame-Options` and `Content-Security-Policy` restrictions.
    - *Constraint*: Many major sites (Google, Twitter, GitHub) block iframe embedding.
    - *Solution*: The application requires a **CORS/Header Proxy** to strip restrictive headers for display purposes. (See Architecture).

## 5. Technical Architecture
### 5.1. Tech Stack
- **Frontend Framework**: React (v18+) with TypeScript.
- **Build Tool**: Vite.
- **Styling**: TailwindCSS (for utility-first styling).
- **State Management**: Zustand (lightweight, suitable for layout state).
- **Grid Library**: `react-grid-layout` or `react-resizable-panels` for robust drag-and-drop grid mechanics.
- **Icons**: Lucide-React or Heroicons.

### 5.2. Data Model
**Profile Schema**:
```typescript
interface Profile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  layout: WindowItem[];
}

interface WindowItem {
  id: string;
  url: string;
  title: string;
  x: number; // Grid X position
  y: number; // Grid Y position
  w: number; // Grid width units
  h: number; // Grid height units
}
```

### 5.3. Proxy Service (Critical)
To bypass `X-Frame-Options: DENY` or `SAMEORIGIN`, the application needs a proxy.
- **Option A (Development/Demo)**: Use a public CORS proxy (e.g., `cors-anywhere` - *Note: often rate-limited or text-only*).
- **Option B (Production)**: A lightweight Node.js/Express proxy middleware or a serverless function (Vercel/Netlify functions) that fetches the target URL and streams the response while stripping `X-Frame-Options` and `Content-Security-Policy` headers.
- **Implementation Note**: The frontend will request `https://my-proxy.com/?url=TARGET_URL`.

## 6. Performance Requirements
- **PR-01**: Dashboard should load saved profiles in under 500ms.
- **PR-02**: Drag and resize operations must be smooth (60fps), using CSS transforms where possible.
- **PR-03**: Iframes should be lazy-loaded or paused when not in the active profile to conserve memory.

## 7. Constraints & Assumptions
- **Browser Security**: Even with a proxy, some sites may break due to complex JS checks or cookie restrictions (SameSite cookies).
- **Mobile Support**: The dashboard is primarily designed for Desktop/Tablet. Mobile view will stack windows vertically.
- **Data Privacy**: All profile data is stored locally in the browser (LocalStorage/IndexedDB). No user data is sent to a central server (unless a sync feature is added later).

## 8. Implementation Roadmap
1.  **Setup**: Initialize React + Vite + Tailwind project.
2.  **Core Components**: Build `WindowFrame`, `GridContainer`.
3.  **State Logic**: Implement `useStore` for profiles and layout state.
4.  **Grid Integration**: Integrate `react-grid-layout`.
5.  **Proxy Integration**: Set up a simple local proxy for testing.
6.  **Profile Management**: UI for adding/switching profiles.
7.  **Polish**: Styling, error handling for broken URLs.
