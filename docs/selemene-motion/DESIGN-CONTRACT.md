# Selemene MotionSkin design contract

The source reference is the exact unlocked MotionSites **Particle Field** prompt saved in `particle-field-reference.md`, retrieved through MotionSites MCP from https://motionsites.ai/?prompt=particle-field. The user explicitly requested MotionSkin and MotionSites for this redesign and approved the existing Selemene copy. This implementation is a branded adaptation with the explicit product deviations below, not a literal pixel clone.

## Preserved mechanics

- Five alternating full-viewport panels; final panel130vh. Discovery is integrated into the hero, followed by preparation, explicit execution, returned values/reflection, and persistence/agency.
- One fixed procedural particle field, with two background star layers; no bloom, postprocessing, loaded model, texture or video.
- Camera distance106→16 interpolates logarithmically using arrival progress `clamp(scroll/.34)`. Dissolve begins at overall scroll.76 and completes at1 through fixed per-point directions, growth and softening.
- Desktop budget6000+260halo, mobile60%; rim share.26, crisp/mid/soft size classes and asymmetric pointer springs.22/.055.
- A single requestAnimationFrame bus with Set subscribers drives Lenis and the field. No separate application scroll listener; delta is bounded to.1s.
- Fine-pointer holes project displacement in the view-perpendicular plane; touch uses layered wander. The flat SVG has no continuous spin, with sway.6.

## Skin

The actual Tryambakam sigil is copied without geometry changes to `public/selemene/assets/tryambakam-sigil.svg`. One512px letterboxed raster samples its interior; outline points use the same viewBox→raster→field mapping, preserving aspect. The source navy `#070b1d`, gold `#c5a017`, parchment and muted silver replace the template mint palette. Approved serif headings and system sans body replace template typography without external font requests.

Current approved website content supersedes the stale recovered MotionSkin brand kit. No live engine count, install availability, scientific/medical claim, legal identity, retention period or private support address is inferred.

## Product deviations and their authority

- The canonical sigil replaces the Hannya sampler. The developer shape selector and FPS display are replaced by an accessible Pause motion control as an implementation choice under the product UX instruction to keep internal controls out of customer flows. This is not a quoted MotionSkin exception.
- A shared responsive navigation shell connects landing, Readings, Privacy, Terms and Support; the approved full overview is preserved in `/selemene/readings/`.
- HTML, shared CSS, shell and motion modules are separated for maintainability. Pinned Three0.185.1 and Lenis1.1.18 plus licenses are served locally under `/selemene/lib/` because the repository globally ignores `vendor/` directories.
- Native scrolling and a static real sigil remain available with JavaScript disabled, failed module imports, WebGL failure, explicit pause or reduced-motion preference. The control is hidden until initialization and disabled while OS reduced motion is active.
- Landing communicates that the ChatGPT integration is in preparation. Policy and support drafts retain explicit pending facts and noindex; design approval does not finalize those facts.

## Verification boundary

Source syntax, local resource resolution and production build are separate from rendered acceptance. Parent IAB testing covers responsive rendering, navigation, scroll, particle approach/dissolve, pause, OS reduced-motion changes and failure fallbacks. No deployment or public submission is implied by this contract.
