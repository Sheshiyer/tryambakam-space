# Mobile Responsiveness Implementation Plan
## 60-Point Deep Dive for All 13 Wings

**Status:** Audit Complete | **Priority:** P0 (Critical) | **Estimated Time:** 4-6 hours

---

## 🔴 CRITICAL ISSUES (Fix First)

### Wing 01 - Witness Yourself (SEVERELY BROKEN)
| # | Issue | Current | Fix |
|---|-------|---------|-----|
| 1 | Only 1 breakpoint | 900px only | Add 768px, 480px, 360px |
| 2 | Close button touch target | ~24px height | 44px min-height |
| 3 | Typewriter overflow | `white-space: nowrap` | Add `overflow: hidden` or wrap |
| 4 | Title font too large | 40px at 900px | Scale to 28px @480px, 24px @360px |
| 5 | Fixed ego fragments obscure content | `position: fixed` | Hide or reposition @768px |
| 6 | HUD repositioning | May overlap title | Stack vertically @768px |

### Wing 09 - Workspace/TUI (CRITICAL)
| # | Issue | Current | Fix |
|---|-------|---------|-----|
| 7 | Slider thumb size | 8×8px | 24×24px minimum |
| 8 | History node touch target | 80×24px | 44×44px minimum |
| 9 | Font sizes too small | 7-10px | 11px minimum for UI |
| 10 | Fixed panel widths | 300px/260px | `min(300px, 90vw)` |
| 11 | Close button padding | 4×12px | 44px min-height |
| 12 | Timeline overflow | No scroll @480px | Add `overflow-x: auto` |

---

## 🟡 HIGH PRIORITY (All Wings)

### Touch Target Violations (< 44px)
| # | Wing | Element | Fix |
|---|------|---------|-----|
| 13 | Hero (00) | Nav links | Add hamburger menu @768px |
| 14 | Somatic (05) | `.backBtn` | `min-height: 44px` |
| 15 | Somatic (05) | `.chapterItem` | `min-height: 44px` |
| 16 | Somatic (05) | `.chapterPill` | `min-height: 44px` |
| 17 | Financial (06) | `.closeBtn` | `min-height: 44px` |
| 18 | Financial (06) | Table rows | `min-height: 44px` |
| 19 | Agents (07) | `.closeBtn` | `min-height: 44px` |
| 20 | Init (08) | `.closeBtn` | `min-height: 44px` |
| 21 | Treasure (09) | `.closeBtn` | `min-height: 44px` |
| 22 | Apothecary (10) | `.closeBtn` | `min-height: 44px` |
| 23 | First Rule (11) | `.closeBtn` | `min-height: 44px` |
| 24 | Begin Journey (12) | `.closeBtn` | `min-height: 44px` |

### Font Size Issues (< 11px @480px)
| # | Wing | Element | Current | Target |
|---|------|---------|---------|--------|
| 25 | Financial (06) | `.tickerTape` | 8px | 11px |
| 26 | Financial (06) | `.dataTable td` | 9px | 11px |
| 27 | Financial (06) | `.ganttLabel p` | 8px | 11px |
| 28 | Agents (07) | `.specKey` | 8px | 11px |
| 29 | Init (08) | `.sysInfo` | 9px | 11px |
| 30 | Init (08) | `.progressText` | 9px | 11px |
| 31 | Treasure (09) | `.quadSpec` | 8px | 11px |
| 32 | Apothecary (10) | `.productEngine` | ~11px | 12px minimum |
| 33 | Apothecary (10) | `.productMeta` | ~11px | 12px minimum |
| 34 | First Rule (11) | `.sysError` | 9px | 11px |
| 35 | First Rule (11) | `.logLine` | 9px | 11px |
| 36 | Begin Journey (12) | `.accessDesc` | ~11px | 12px minimum |

---

## 🟢 MEDIUM PRIORITY

### Hover→Touch Conversion
| # | Wing | Element | Add `:active` State |
|---|------|---------|---------------------|
| 37 | Three Pillars (03) | Pillar hover dimming | Add touch alternative |
| 38 | Matrix (04) | `.engineCell:hover` | Add `:active` |
| 39 | Financial (06) | `.closeBtn:hover` | Add `:active` |
| 40 | Financial (06) | `.actBtn:hover` | Add `:active` |
| 41 | Agents (07) | Agent portraits | Add `:active` border |
| 42 | Init (08) | All buttons | Add `:active` |
| 43 | Treasure (09) | `.quadrant:hover` | Add `:active` |
| 44 | Apothecary (10) | `.featureCard:hover` | Add `:active` |
| 45 | Apothecary (10) | `.productCard:hover` | Add `:active` |
| 46 | First Rule (11) | `.glitchTitle:hover` | Add `:active` |
| 47 | Begin Journey (12) | `.accessCard:hover` | Add `:active` |
| 48 | Workspace (09) | `.booleanBtn:hover` | Add `:active` |

### Feature Loss on Mobile
| # | Wing | Feature | Solution |
|---|------|---------|----------|
| 49 | Somatic (05) | Chapter list hidden @900px | Add mobile nav drawer |
| 50 | Init (08) | Specs sidebar hidden @768px | Add toggle button |
| 51 | Treasure (09) | Floating specs hidden @900px | Integrate into main content |

### Missing Breakpoints
| # | Wing | Add 360px Support |
|---|------|-------------------|
| 52 | Hero (00) | Title scaling, nav adjustments |
| 53 | Witness (01) | Complete mobile layout |
| 54 | Three Pillars (03) | Card sizing adjustments |
| 55 | Matrix (04) | Grid cell sizing |
| 56 | Somatic (05) | Typography scaling |
| 57 | Financial (06) | Terminal density reduction |
| 58 | Agents (07) | Portrait sizing |
| 59 | Init (08) | Console scaling |
| 60 | All Wings | iPhone SE/Mini testing |

---

## Implementation Strategy

### Phase 1: Critical Fixes (Wings 01, 09)
- Wing 01: Add missing breakpoints, fix typewriter, reposition fragments
- Wing 09: Fix slider, history nodes, font sizes, panel widths

### Phase 2: Touch Targets (All Wings)
- Add `min-height: 44px` to all interactive elements
- Add `min-width: 44px` where applicable
- Test with Chrome DevTools touch simulation

### Phase 3: Typography (All Wings)
- Audit all font sizes at 480px breakpoint
- Increase anything <11px to 11px minimum
- Test readability on actual devices

### Phase 4: Hover→Touch (All Wings)
- Add `:active` states alongside `:hover`
- Use `@media (hover: hover)` for hover-only effects
- Add touch-specific interactions

### Phase 5: Feature Loss (Selected Wings)
- Somatic: Mobile chapter navigation
- Init: Mobile sidebar toggle
- Treasure: Floating content integration

---

## Testing Checklist

- [ ] Test on iPhone 14 Pro (390px)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 Mini (360px)
- [ ] Test on iPad Mini (768px)
- [ ] Test on iPad Pro (1024px)
- [ ] Chrome DevTools device simulation
- [ ] Firefox Responsive Design Mode
- [ ] Safari iOS Simulator
- [ ] Touch target audit with a11y tools
- [ ] Font size readability test

---

## Success Criteria

✅ All interactive elements ≥44×44px touch targets  
✅ All font sizes ≥11px at 480px breakpoint  
✅ No horizontal overflow at 360px width  
✅ All hover effects have touch alternatives  
✅ All 13 wings usable on iPhone SE  
✅ Lighthouse mobile score ≥90  
