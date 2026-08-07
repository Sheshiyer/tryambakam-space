# Selemene Engine ↔ Website Copy Audit

**Date:** 2026-06-27  
**Auditor:** opencode (k2p7)  
**Scope:** Cross-check Tryambakam Noesis website copy against Selemene Engine code as the source of truth.  
**Method:** Structural code review of `Selemene-engine/.context/baseline/engine-matrix.json`, `crates/noesis-orchestrator/src/workflow/registry.rs`, `crates/noesis-orchestrator/src/lib.rs`, `ts-engines/src/types/engine.ts`, and website `src/data/engines.ts`, `src/wing-page/data.ts`, plus all templates that reference engine counts or names.

## Status: Website + Core Selemene Docs Updated

- Website now references **17 engines** and includes `raaga` as E-17 in the engine matrix.
- `src/data/engines.ts` now maps every website engine to its canonical Selemene `engine_id` via `selemeneEngineId`.
- Selemene core docs updated: `README.md`, `docs/ENGINES.md`, `docs/PROJECT_OVERVIEW.md`, `.github/copilot-instructions.md`, `packages/noesis-sdk-ts/README.md`, `.context/baseline/engine-matrix.json`.
- Remaining Selemene references to "16 engines" (~70 files in `.context/`, `docs/portal/`, scripts, SDK source comments, release notes, tests) were left in place and are listed in the remediation plan below for a follow-up pass.
- Verification: `npm run check` and `npm run build` pass; Playwright screenshot confirms the engine matrix renders all 17 engines.

---

## 1. Source of Truth (Selemene Engine Code)

### 1.1 Engine Registry
The canonical engine list is defined in workflow/engine registration code, **not** in `.context/baseline/engine-matrix.json`.

**Rust engines (11)**
| engine_id | crate |
|-----------|-------|
| biofield | engine-biofield |
| biorhythm | engine-biorhythm |
| face-reading | engine-face-reading |
| gene-keys | engine-gene-keys |
| human-design | engine-human-design |
| nadabrahman | engine-nadabrahman |
| numerology | engine-numerology |
| panchanga | engine-panchanga |
| transits | engine-transits |
| vedic-clock | engine-vedic-clock |
| vimshottari | engine-vimshottari |

**TypeScript / sidecar engines (6)**
| engine_id | package |
|-----------|---------|
| enneagram | noesis-ts-engines |
| i-ching | noesis-ts-engines |
| raaga | noesis-web (apps/noesis-web/src/lib/raaga) |
| sacred-geometry | noesis-ts-engines |
| sigil-forge | noesis-ts-engines |
| tarot | noesis-ts-engines |

**Total canonical engines: 17.**

Evidence:
- `crates/noesis-orchestrator/src/workflow/registry.rs` line 565-583 lists 17 engine_ids for the `full-spectrum` workflow.
- `crates/noesis-orchestrator/src/lib.rs` line 551-583 confirms the same 17 engines in its legacy workflow registry.

### 1.2 Workflow Registry (6 workflows)
Source: `crates/noesis-orchestrator/src/workflow/registry.rs`

| workflow_id | engines used |
|-------------|--------------|
| birth-blueprint | numerology, human-design, vimshottari, biofield, face-reading |
| daily-practice | panchanga, vedic-clock, biorhythm, transits, nadabrahman |
| decision-support | tarot, i-ching, human-design, enneagram, gene-keys |
| self-inquiry | gene-keys, enneagram, face-reading, biofield |
| creative-expression | sigil-forge, sacred-geometry, raaga |
| full-spectrum | all 17 engines |

### 1.3 Stale Selemene Docs
- `.context/baseline/engine-matrix.json` says `total_engines: 16` and omits `raaga` entirely.
- `.context/baseline/workflow-parity.json` says `workflow_count: 6` (correct) but its engine lists omit `raaga` and `transits` in `full-spectrum`.
- `README.md` says "16 engines" in the hero subtitle and feature list.
- `data/wisdom-docs/WISDOM-DATA-INDEX.md` says "13 Wisdom Systems" and "all 16 engine systems" — it omits `raaga` and `transits` as first-class systems and double-counts some data categories.

---

## 2. Website Gaps and Mismatches

### 2.1 Engine Count Mismatch
The website repeatedly claims **16 engines**. This is false against current Selemene code.

Affected files and lines:
- `src/data/engines.ts` — exports 16 engines, missing `raaga`.
- `src/wing-page/data.ts:213` — "16 mirrors. 11 Rust engines. 5 TypeScript lenses."
- `src/wing-page/templates/EngineMatrixTemplate.tsx:88` — "initializing 16 symbolic-computational lenses"
- `src/wing-page/templates/EngineMatrixTemplate.tsx:89` — "mapping 256 permutations — 16 engines × 4 compass directions"
- `src/wing-page/templates/EngineMatrixTemplate.tsx:131` — "View all 16 engines →"
- `src/wing-page/templates/WorkspaceTemplate.tsx:196` — "View all 16 engines →"
- `src/wing-page/templates/WitnessAgentsTemplate.tsx:18` — "Pattern Recognition — identifies symbolic-computational lenses across 16 engines"
- `src/app/TerminalEgg.tsx:80` — "Tier: FREE — 16 engines × 4 compass directions"
- `src/app/TerminalEgg.tsx:129` — "Use this key at /#sixteen-engines to consult all 16 engines."

### 2.2 Engine Identity Mismatch
The website uses **branded display names** that do not map 1:1 to Selemene `engine_id`s. This makes integration copy hard to verify and confuses SDK/API users.

| Website name | Maps to Selemene engine_id | Notes |
|--------------|----------------------------|-------|
| Temporal Grammar | panchanga | OK but non-obvious |
| Chronofield | vimshottari | OK but non-obvious |
| Energetic Authority | human-design | OK but non-obvious |
| Gift-Shadow Spectrum | gene-keys | OK but non-obvious |
| Numeric Architecture | numerology | OK but non-obvious |
| Three-Wave Cycle | biorhythm | OK but non-obvious |
| Circadian Cartography | vedic-clock | OK but non-obvious |
| Bioelectric Field | biofield | OK but non-obvious |
| Physiognomic Mapping | face-reading | OK but non-obvious |
| Resonance Architecture | nadabrahman | OK but non-obvious |
| Active Planetary Weather | transits | OK but non-obvious |
| Archetypal Mirror | tarot | OK but non-obvious |
| Hexagram Navigation | i-ching | OK but non-obvious |
| Nine-Point Architecture | enneagram | OK but non-obvious |
| Geometric Resonance | sacred-geometry | OK but non-obvious |
| Sigil Forge | sigil-forge | Exact match |
| **Raaga / Raga Resonance** | **raaga** | **Missing from website engines.ts** |

The website mentions "Raga Resonance × 72 Melakarta" in `src/wing-page/data.ts:218` but never defines a corresponding engine card.

### 2.3 Workflow Mismatch
The website has no page or data file that reflects the 6 canonical Selemene workflows. Wing copy invents its own groupings (e.g., `InfiniteTreasureTemplate.tsx` quadrants) that do not match `birth-blueprint`, `daily-practice`, `decision-support`, `self-inquiry`, `creative-expression`, or `full-spectrum`.

### 2.4 Product-to-Engine Mappings Are Soft
`src/data/products.ts` maps products to branded engine names (e.g., "Resonance Architecture"). There is no canonical product catalog in Selemene to verify against, so these are marketing copy rather than grounded integrations.

### 2.5 Factual Claims — Mostly Accurate
The following specific numbers in website copy check out against wisdom data and general domain knowledge:
- 64 Human Design gates / Gene Keys — correct.
- 27 lunar mansions (nakshatras) — correct.
- 72 Melakarta ragas — correct.
- 120-minute Tattva cycle (5 elements × 24 min) — correct.
- 120-year Vimshottari Dasha cycle — correct.
- 0.1 Hz coherent breath / HRV — standard figure.
- 14 TCM meridians/channels — 12 primary + 2 extraordinary = 14, correct.
- "Three meters" for heart EMF — slightly generous but in literature ballpark.

---

## 3. Remediation Plan

### Phase A — Fix Selemene Source of Truth (priority: high) ✅ DONE
These changes prevent the website from inheriting stale assumptions.

1. **Update `.context/baseline/engine-matrix.json`** ✅
   - Changed `counts.total_engines` to `17`.
   - Added `raaga` to `ts_engines` array with package metadata.
   - Noted `nadabrahman` vs `raaga` distinction: `nadabrahman` is the Rust acoustic analysis engine; `raaga` is the TS generative raga engine.

2. **Update `.context/baseline/workflow-parity.json`** ⏭️ PENDING
   - Add `raaga` and `transits` to `full-spectrum` engine list.
   - Verify each workflow's engine list against `registry.rs`.

3. **Update `README.md`** ✅
   - Changed "16 engines" to "17 engines" everywhere.
   - Added `Raaga` to the TypeScript engines table.
   - Updated workflow `full-spectrum` copy and engine-family lists.

### Phase B — Update Website Engine Data (priority: high) ✅ DONE

4. **Add `raaga` to `src/data/engines.ts`** ✅
   - Assigned id `17`, category `"TS Bridge"`, compass direction `W`, label `MUTATE`, kosha layer `Anandamaya`.
   - `whatItComputes`: "Generative rāga composition — 72 Melakarta melodic maps for state-specific practice".

5. **Normalize engine data shape** ✅
   - Added a `selemeneEngineId` field to each `Engine` record so every website engine maps unambiguously to Selemene.
   - Added `getEngineBySelemeneId()` helper.

6. **Update `src/wing-page/data.ts`** ✅
   - Changed "16 mirrors. 11 Rust engines. 5 TypeScript lenses" to "17 mirrors. 11 Rust engines. 6 TypeScript lenses".
   - Updated permutations 256 → 272.
   - Moved "Raga Resonance × 72 Melakarta" from prose into the explicit engine list via E-17.

### Phase C — Update Templates and Copy (priority: medium) ✅ DONE

7. **Global find/replace "16 engines" → "17 engines"** ✅
   - `EngineMatrixTemplate.tsx`
   - `WorkspaceTemplate.tsx`
   - `WitnessAgentsTemplate.tsx`
   - `TerminalEgg.tsx`
   - `src/wing-page/data.ts`
   - `ThreePillarsTemplate.tsx`
   - `BeginJourneyTemplate.tsx`

8. **Update `EngineMatrixTemplate.tsx`** ✅
   - Kept the 4×4 grid for the first 16 engines.
   - Added `raaga` (E-17) as a full-width "bridge cell" below the matrix.
   - Updated CLI readout to 17 engines / 272 permutations.

9. **Update `InfiniteTreasureTemplate.tsx`** ✅
   - Added `Raga Resonance` to the `S — CREATE` quadrant.

10. **Update `TerminalEgg.tsx`** ✅
    - Changed tier line to "17 engines × 4 compass directions".
    - Kept `/#sixteen-engines` slug for URL compatibility.

### Phase D — Introduce Workflows to Website (priority: medium) ⏭️ PENDING

11. **Create `src/data/workflows.ts`** ⏭️
    - Mirror the 6 Selemene workflows from `registry.rs`.
    - Map each workflow to its `engine_ids` and a consumer-facing description.

12. **Surface workflows on relevant wings** ⏭️
    - `Witness Yourself`, `Self Integration`, `Sixteen Engines`, `Begin Journey` wings should reference workflows instead of inventing ad-hoc engine groupings.

### Phase E — Verification (priority: high) ✅ DONE

13. **Add a sync test/CI guard** ⏭️ PENDING
    - A simple script that loads `Selemene-engine/.context/baseline/engine-matrix.json` and `tryambakam-space/src/data/engines.ts` and asserts counts + ID coverage match.

14. **Run full checks** ✅
    - `npm run check` in website: passed.
    - `npm run build` in website: passed.
    - Playwright screenshot of Engine Matrix wing confirms 17 engines including `raaga` as E-17.

---

## 4. Risk Notes

- **Branded names vs canonical IDs:** Do not replace branded names with raw Selemene IDs unless the user explicitly wants a technical rebrand. The recommended fix is to keep branded names for users but add canonical IDs in data and tooltips for developers.
- **Grid redesign:** Adding a 17th engine is a visual breaking change. Treat as a design task, not just a data task.
- **`raaga` maturity:** If `raaga` is not yet exposed by the public API, the website should label it as "coming soon" rather than silently omit it.
- **URL slug `/#sixteen-engines`:** Keep for backward compatibility; do not break existing links.

---

## 5. File-Level Action Checklist

| File | Action | Phase |
|------|--------|-------|
| `Selemene-engine/.context/baseline/engine-matrix.json` | Add `raaga`, update counts to 17 | A |
| `Selemene-engine/.context/baseline/workflow-parity.json` | Sync engine lists with `registry.rs` | A |
| `Selemene-engine/README.md` | Update "16 engines" references | A |
| `tryambakam-space/src/data/engines.ts` | Add `raaga`, add `selemeneEngineId` mapping | B |
| `tryambakam-space/src/wing-page/data.ts` | Update 16→17, surface raaga | B |
| `tryambakam-space/src/data/workflows.ts` | Create new workflow mirror | D |
| `tryambakam-space/src/wing-page/templates/EngineMatrixTemplate.tsx` | Redesign grid for 17 engines, update copy | C |
| `tryambakam-space/src/wing-page/templates/InfiniteTreasureTemplate.tsx` | Add raaga to quadrant or switch to workflows | C |
| `tryambakam-space/src/wing-page/templates/WorkspaceTemplate.tsx` | Update 16→17 copy | C |
| `tryambakam-space/src/wing-page/templates/WitnessAgentsTemplate.tsx` | Update 16→17 copy | C |
| `tryambakam-space/src/app/TerminalEgg.tsx` | Update 16→17 copy | C |
| `tryambakam-space/src/data/products.ts` | Add canonical engine ID mapping (optional) | D |

---

*End of audit.*
