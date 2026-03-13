# Swarm Architecture Plan: Mobile Responsiveness & CTA Funnels

**Target:** Tryambakam Noesis Primary Production Website **Mode:** Full
Production Readiness | **Release:** Single Milestone | **Constraint:** Mobile
Performance Middle-Ground

---

## Phase 1: Mobile Readiness & WebGL Optimization

### Wave 1.1: WebGL Mobile Performance Tuning

#### Swarm 1.1.A: Renderer & Device Scaling

- [ ] `TASK-101`: [WebGL] Implement dynamic `dpr` (device pixel ratio) scaling
      based on frame rate limits
- [ ] `TASK-102`: [WebGL] Cap `dpr` to 1.5 on mobile devices to prevent thermal
      throttling
- [ ] `TASK-103`: [WebGL] Disable heavy post-processing passes (e.g., bloom)
      automatically on low-tier mobile GPUs
- [ ] `TASK-104`: [WebGL] Configure React Three Fiber `PerformanceMonitor` to
      gracefully step down resolution during heavy interactions
- [ ] `TASK-105`: [WebGL] Review and optimize the central `ResonanceWave` shader
      logic for mobile GPU vertex limits
- [ ] `TASK-106`: [WebGL] Add a `useMobile` hook context to globally pass device
      capability states to the 3D scene
- [ ] `TASK-107`: [WebGL] Profile texture memory footprint across the 14 Wing
      cards and optimize to WebP/compressed formats
- [ ] `TASK-108`: [WebGL] Write performance verification tests for sustained >30
      FPS on simulated mobile CPU profiles

#### Swarm 1.1.B: Scene Geometry & Draw Calls

- [ ] `TASK-109`: [Geometry] Audit all instanced meshes within the canvas for
      instance count reductions on mobile
- [ ] `TASK-110`: [Geometry] Implement frustum culling overrides for out-of-view
      Wing text blocks
- [ ] `TASK-111`: [Materials] Downsample normal/roughness maps for 3D UI
      elements on mobile breakpoints
- [ ] `TASK-112`: [Materials] Consolidate material variations to reduce WebGL
      draw call batches
- [ ] `TASK-113`: [Memory] Implement aggressive garbage collection/disposal for
      textures when UI overlays are active
- [ ] `TASK-114`: [Load] Implement progressive loading/lazy evaluation for
      off-screen Wing models

### Wave 1.2: Canvas Touch Interaction Parity

#### Swarm 1.2.A: Camera Controls & Touch Tracking

- [ ] `TASK-115`: [Camera] Implement pinch-to-zoom bounds configured uniquely
      for mobile portrait framing
- [ ] `TASK-116`: [Camera] Adjust `MapControls` / pan inertia to feel tactile
      and snappy on capacitive touch screens
- [ ] `TASK-117`: [Camera] Disable dual-touch rotation if it conflicts with the
      2D plane logic of the cards
- [ ] `TASK-118`: [Camera] Ensure camera framing correctly offsets "center" when
      bottom navigation drawers are open on mobile

#### Swarm 1.2.B: Raycasting & Hit Targets

- [ ] `TASK-119`: [Interactivity] Increase hit-box size (invisible bounding
      boxes) for all 3D Wing cards to accommodate fingertip tap targets
- [ ] `TASK-120`: [Interactivity] Implement a global touch-debounce to prevent
      accidental double-tap zooming on 3D elements
- [ ] `TASK-121`: [Interactivity] Prevent WebGL raycast overlaps when HTML
      overlays (like the HUD) are active
- [ ] `TASK-122`: [Interactivity] Translate mouse 'hover' scaling logic into
      'first tap' selection states for mobile devices
- [ ] `TASK-123`: [Interactivity] Ensure "unclickable card" overlay bug is fully
      patched in the hybrid touch-event model

### Wave 1.3: Overlay UI & 2D Layout Responsiveness

#### Swarm 1.3.A: Infinite Frame & Cardinals

- [ ] `TASK-124`: [UI Frame] Refactor `style.module.css` frame padding to
      collapse gracefully on viewport widths < 600px
- [ ] `TASK-125`: [UI Frame] Shrink new `Asset 5.svg` logo size by 20% on mobile
      breakpoints
- [ ] `TASK-126`: [UI Cardinals] Adjust `writing-mode` layout padding for the 4
      cardinal words to prevent text clipping on narrow screens
- [ ] `TASK-127`: [UI Tags] Hide or consolidate scattered hashtags (`#witness`,
      `#apothecary` etc.) behind a menu or fade them out entirely on extra-small
      mobile screens to reduce clutter
- [ ] `TASK-128`: [HUD] Ensure the bottom minimap component collapses or docks
      efficiently on mobile devices

#### Swarm 1.3.B: Terminal & Overlay Typography

- [ ] `TASK-129`: [Terminal] Fix Terminal mode typing overlay to support native
      mobile keyboards without resizing layout thrash
- [ ] `TASK-130`: [Typography] Implement completely fluid typography (`clamp()`)
      for all central and overlay texts
- [ ] `TASK-131`: [Layout] Ensure modal content (Wing templates) use
      safe-area-insets to avoid iOS notches and bottom bars

---

## Phase 2: CTA Funnel Architecture & Routing

### Wave 2.1: Routing & State Management

#### Swarm 2.1.A: Funnel State Machine

- [ ] `TASK-201`: [State] Initialize a global `useFunnelStore` context (via
      Zustand or React Context) to track the active user journey
- [ ] `TASK-202`: [State] Define the schema for `VisitorIntent` (e.g., Browsing,
      Seeking Consult, Product Signup)
- [ ] `TASK-203`: [State] Store referral/UTM parameters in local storage to pass
      through to final downstream platforms
- [ ] `TASK-204`: [UX] Create a global "Active Journey" UI indicator inside the
      HUD
- [ ] `TASK-205`: [Data] Map standard entry to completion journey times to
      trigger automated reminder toasts if inactive

#### Swarm 2.1.B: Deep Linking & External Routing

- [ ] `TASK-206`: [Routing] Define standard URL schemas (`/wing/[id]`,
      `/wing/[id]/checkout`) for correct shareable permalinks
- [ ] `TASK-207`: [Routing] Configure physical History API sync so mobile
      back-buttons close 3D wing popups instead of exiting the site
- [ ] `TASK-208`: [Routing] Implement Next-friendly static routing logic
      ensuring standard SEO meta tags are fired for individual funnels

### Wave 2.2: Universal Integration Wiring

#### Swarm 2.2.A: Calendly / Consultation Hand-off

- [ ] `TASK-209`: [Calendly] Integrate `react-calendly` popup injection into the
      base UI provider
- [ ] `TASK-210`: [Calendly] Wire "Request Consultation" CTA buttons in Wings to
      directly invoke the modal payload with pre-filled identifiers
- [ ] `TASK-211`: [Calendly] Add post-booking webhooks/callbacks to return the
      user nicely to the Canvas with a success state payload
- [ ] `TASK-212`: [Forms] Implement a fallback native form UI in case Calendly
      embed fails to load or viewport constraints block it

#### Swarm 2.2.B: Auth & Platform Hand-off

- [ ] `TASK-213`: [Auth] Map out OAuth or token-passing infrastructure if
      passing user session to external Dashboards
- [ ] `TASK-214`: [Auth] Create the unified "Sign Up To The Vault" standard
      onboarding modal component
- [ ] `TASK-215`: [Auth] Embed explicit redirect logic appending `.branch` query
      logic for the external 01-Projects domains
- [ ] `TASK-216`: [UX] Draft loading/transition sequences representing the
      "Warping to..." state when redirecting to external project dashboards

---

## Phase 3: Wing-Specific Funnels

### Wave 3.1: Creative/Story Wings Onboarding

#### Swarm 3.1.A: Somatic Canticles Route

- [ ] `TASK-301`: [Canticles] Create specific "Read Chapter 1" CTA component
      mapping
- [ ] `TASK-302`: [Canticles] Wire up the eBook Waitlist signup variation for
      the CTA
- [ ] `TASK-303`: [Canticles] Perform UI validation on mobile layout of the
      Somatic Canticles modal container

#### Swarm 3.1.B: Witness Route

- [ ] `TASK-304`: [Witness] Implement "Experience the Witness" standalone CTA
      action
- [ ] `TASK-305`: [Witness] Link Witness CTA to the specific sensory
      sub-application link
- [ ] `TASK-306`: [Witness] Map analytics events specifically for the Witness
      conversion funnel

### Wave 3.2: Analytics/System Wings Onboarding

#### Swarm 3.2.A: Sixteen Engines

- [ ] `TASK-307`: [Sixteen] Build the API integration mapping for "Request 16
      Engines Audit"
- [ ] `TASK-308`: [Sixteen] Insert the requisite data-collection pre-qualifier
      form before hitting Calendly
- [ ] `TASK-309`: [Sixteen] Optimize the Sixteen Engines internal modal layout
      for mobile viewing

#### Swarm 3.2.B: Apothecary & Residual

- [ ] `TASK-310`: [Apothecary] Link Apothecary product interactions directly to
      the e-commerce branch (Shopify/Stripe checkout URL mapping)
- [ ] `TASK-311`: [Apothecary] Support query parameter forwarding for cart
      states
- [ ] `TASK-312`: [All Wings] Audit remaining 10 Wing templates ensuring every
      single one has an explicit exit/conversion CTA configured

---

## Phase 4: Global Milestone Hardening

### Wave 4.1: End-to-End Funnel Testing

#### Swarm 4.1.A: Device Lab Playwright Specs

- [ ] `TASK-401`: [Playwright] Write interaction tests evaluating Canvas load to
      Wing Modal load speeds
- [ ] `TASK-402`: [Playwright] Write E2E test verifying Calendly modal injection
      correctly executes
- [ ] `TASK-403`: [Playwright] Simulate iOS Safari and verify no 100vh jumping
      bugs during scroll
- [ ] `TASK-404`: [Playwright] Simulate Android Chrome and trigger WebGL context
      loss recovery flow
- [ ] `TASK-405`: [Playwright] Test all external CTA redirect headers

#### Swarm 4.1.B: Error Handling & Degradation

- [ ] `TASK-406`: [Errors] Implement global ErrorBoundary explicitly for WebGL
      crashes, offering a pure 2D HTML funnel standard fallback
- [ ] `TASK-407`: [Errors] Implement automatic refresh/reconnect UI if
      navigation state breaks
- [ ] `TASK-408`: [Testing] Validate network failure mid-form submission during
      onboarding flows

### Wave 4.2: Final Launch Polish

#### Swarm 4.2.A: Analytics Instrumentation

- [ ] `TASK-409`: [Analytics] Attach standard Vercel Analytics / PostHog custom
      events inside the `useFunnelStore`
- [ ] `TASK-410`: [Analytics] Emit detailed metrics on average WebGL framerate
      derived from user
- [ ] `TASK-411`: [Analytics] Track which quadrant/cardinal map segment gets the
      most initial traction

#### Swarm 4.2.B: Polish & Review

- [ ] `TASK-412`: [UX Polish] Run a final aUX assessment against the 50% "middle
      ground" of interactive performance versus mobile accessibility
- [ ] `TASK-413`: [Code Quality] Enforce strict linting and dead code
      elimination on the 3D asset bundles
- [ ] `TASK-414`: [Documentation] Write final README integration hooks for new
      external domains to hook back to Tryambakam payload logic
- [ ] `TASK-415`: [CI/CD] Add final automated lighthouse performance thresholds
      blocking deployment if the frame drops below 40 mobile standard.
- [ ] `TASK-416`: [Merge] Merge all Swarms into single launch candidate `main`
      branch tag.
