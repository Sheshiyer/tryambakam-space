#!/usr/bin/env python3
"""
Generate 20 website wing images for Tryambakam Noesis using FAL AI nano-banana-pro.

Prompts follow the V3 Visual Prompt Cookbook "Bioluminescent Consciousness" theme
and Amir Mushich's Nano Banana Pro prompt architecture.

Brand facts (from brand-docs-final):
- 16 engines (11 Rust + 5 TypeScript), NOT 13
- Kha-Ba-La framework (Spirit/Body/Inertia)
- 4 compass directions: STABILIZE / HEAL / CREATE / MUTATE
- 6 workflows: birth-blueprint, daily-practice, decision-support, self-inquiry, creative-expression, full-spectrum
- Somatic Canticles: 3 books, 27 chapters total
- The Plumber: 12-episode manga, 33 pages each
- Financial Biosensor: not "Decision Oracle"
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# Load FAL_KEY from ~/.claude/.env
def load_fal_key():
    env_path = os.path.expanduser("~/.claude/.env")
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("FAL_KEY="):
                val = line[len("FAL_KEY="):]
                return val.strip("'\"")
    raise RuntimeError("FAL_KEY not found in ~/.claude/.env")

FAL_KEY = load_fal_key()
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "artworks" / "wings"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# V3 Brand Constants
BRAND_CONTEXT = """Tryambakam Noesis — Practice Platform for Self-Consciousness.
Theme: Bioluminescent Consciousness. Goethe's Theory of Colours (polarity, not spectrum).
Colors: Void Black #070B1D (canvas), Witness Violet #2D0050 (observer/Kha), Flow Indigo #0B50FB (flow), Sacred Gold #C5A017 (activation/Ba), Coherence Emerald #10B5A7 (resolution), Parchment #F0EDE3 (text), Muted Silver #8A9BA8 (secondary), Deep Surface #0E1428 (cards).
Typography: Panchang (display — wide industrial-panoramic), Satoshi (body — geometric sans-serif), SF Mono (data/code).
Materials: Bronze, leather, unglazed ceramic, dark wood, brass. Sigil engraved or cast, never printed.
Mood: Bioluminescent, anatomical, emergent, Goethe-principled, load-bearing sacred geometry.
Photography: Dark-field. Subject emerges from darkness. No external light sources. No faces. Textural macro.
"""

NEGATIVE = "wellness aesthetic, soft lighting, pastel colors, gradient backgrounds, vaporwave, synthwave, New Age imagery, third eye, lotus cliche, mandala decoration, chakra rainbow, stock photo, posed faces, glossy plastic, rounded corners, steampunk, cyberpunk neon, retro-futurism, lens flare, HDR, chrome excess, Matrix green, anime, cartoon, pixel art, warm cozy lighting, meditation poses, nature-as-wellness, clinical white backgrounds"

# 20 Wing Prompts — each maps to a website section
# Using Amir Mushich Nano Banana Pro prompt architecture:
# Act as [ROLE]. Create [SPECIFIC DELIVERABLE]. [DETAILED VISUAL SPEC]. [MATERIALS]. [LIGHTING]. [CONSTRAINTS].
WING_PROMPTS = [
    # 1. HERO — The Oasis entrance
    {
        "id": "01-hero",
        "title": "Hero — Self-Generating Code Well",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Lead Brand Designer creating a hero banner for Tryambakam Noesis website.

A vast Void Black (#070B1D) expanse. At center, the resonance pattern sigil — nested sacred geometry with compass-pointed frame and lotus-form core — rendered as Sacred Gold (#C5A017) wireframe with Coherence Emerald (#10B5A7) bioluminescent glow radiating from the lotus center. The sigil is massive, architectural, load-bearing — not decorative.

Kha Arc gradient atmosphere (#070B1D → #2D0050 → #0B50FB) in deep background creating a sense of vast depth. Constellation grid: hairline Sacred Gold dots connected at 20% opacity extending to all edges. Four compass directions visible at cardinal points: STABILIZE (N), HEAL (E), CREATE (S), MUTATE (W).

Dark-field. No external light sources. Bioluminescent principle — light originates from within the geometry itself. 8K quality. Behance/Awwwards aesthetic. Sharp edges only. The geometry carries the visual weight. Cinematic depth."""
    },

    # 2. WITNESS YOURSELF — The problem statement
    {
        "id": "02-witness-yourself",
        "title": "Witness Yourself — The Recursive Loop",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Art Director creating an atmospheric concept image for "Witness Yourself" — the idea that self-consciousness is the recursive loop of witnessing.

A solitary figure seen from behind (silhouette only, no face), standing before an infinite recursive mirror effect — each reflection slightly shifted, revealing layers of the same observer observing themselves. The mirrors rendered as thin Sacred Gold (#C5A017) wireframe rectangles receding into Void Black (#070B1D) depth. Each reflection layer has a subtle color shift through the Consciousness Color Spectrum: nearest is Parchment (#F0EDE3), then Sacred Gold, then Coherence Emerald (#10B5A7), then Flow Indigo (#0B50FB), then Witness Violet (#2D0050), then Void Black.

The figure is grounded, still, dark silhouette. No mystical imagery. The recursion IS the message. Constellation grid visible in the deepest layer. Dark-field lighting. Bioluminescent glow from the mirror edges only. Cinematic, philosophical, austere. 8K quality."""
    },

    # 3. SELF INTEGRATION — The architecture
    {
        "id": "03-self-integration",
        "title": "Self Integration — Regenerative Intelligence Field",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Creative Director creating a visual metaphor for "Self-Regenerative Intelligence Field" — a system that learns with you, guides without overriding, cycles like breath.

Overhead view of a vast circular mandala-like architectural blueprint on Void Black (#070B1D) surface. NOT a decorative mandala — an architectural schematic. Sixteen radial segments (representing the 16 engines) drawn in Sacred Gold (#C5A017) precision wireframe. Each segment contains a unique sacred geometry pattern — different for each engine. At the center: the resonance pattern sigil glowing with Coherence Emerald (#10B5A7) bioluminescence.

Connecting pathways between segments rendered as thin Flow Indigo (#0B50FB) lines showing the six synthesis workflows. The four compass directions (STABILIZE, HEAL, CREATE, MUTATE) at cardinal positions in SF Mono micro-text. The whole structure breathes with subtle Kha Arc gradient atmospheric depth.

Architectural rendering style. Precision linework. Dark-field. No decoration. The structure IS the beauty. 8K detail on geometric linework."""
    },

    # 4. THREE PILLARS — Kha-Ba-La
    {
        "id": "04-three-pillars",
        "title": "Three Pillars — Kha-Ba-La Trinity",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Visual Architect creating a triptych composition for "Kha-Ba-La" — the three co-arising forces: Spirit (Kha/Observer), Body (Ba/Embodiment), Inertia (La/Friction).

Three vertical columns on Void Black (#070B1D) canvas, separated by thin Sacred Gold (#C5A017) lines:

LEFT COLUMN (Kha/Spirit): Witness Violet (#2D0050) atmosphere with sacred geometry eye-form pattern (NOT a third eye — a geometric aperture). Constellation grid visible. The observer state. Subtle Kha Arc gradient (#070B1D → #2D0050 → #0B50FB).

CENTER COLUMN (Ba/Body): Sacred Gold (#C5A017) atmosphere with anatomical sacred geometry — vertebral column rendered as geometric architecture, each vertebra a distinct sacred geometry node. Ba Arc gradient (#10B5A7 → #C5A017). Warm, grounded.

RIGHT COLUMN (La/Inertia): Deep Void Black with La Arc gradient (#C5A017 → #2D0050 → #070B1D). Heavy geometric forms — stacked, gravitational, compressed sacred geometry. The weight that gives form.

Each column has Panchang typography label at top: "KHA" / "BA" / "LA". Below each: "Spirit" / "Body" / "Inertia" in Satoshi. 8K. Architectural precision. Dark-field. No mysticism — pure structure."""
    },

    # 5. SIXTEEN ENGINES — The computational core
    {
        "id": "05-sixteen-engines",
        "title": "Sixteen Engines — Symbolic-Computational Lenses",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Data Visualization Designer creating a schematic diagram of the 16 Symbolic-Computational Engines of Tryambakam Noesis.

A 4x4 grid of sixteen distinct sacred geometry engine icons on Void Black (#070B1D) canvas. Each icon in a square cell with 1px Muted Silver (#8A9BA8) border. Each icon rendered in Sacred Gold (#C5A017) precision wireframe:

Row 1 (Vedic): Temporal Grammar (5 concentric rings), Chronofield (orbital rings with markers), Bioelectric Field (body silhouette with field lines), Energetic Authority (bodygraph diamond).
Row 2 (Western): Gift-Shadow Spectrum (three-tiered wave), Active Planetary Weather (globe with transits), Nine-Point Architecture (enneagram geometry), Numeric Architecture (Fibonacci digits).
Row 3 (Bridge): Archetypal Mirror (card silhouette), Circadian Cartography (12-segment clock), Three-Wave Cycle (overlapping sine waves), Physiognomic Mapping (face grid).
Row 4 (Synthesis): Resonance Architecture (frequency waveform), Hexagram Navigation (six-line stack), Geometric Resonance (nested platonic solids), Sigil Forge (glyph construction).

SF Mono micro-labels below each icon. A thin Coherence Emerald (#10B5A7) glow connecting all 16 icons in a network. Deep Surface (#0E1428) cell backgrounds. Technical diagram aesthetic. 8K precision."""
    },

    # 6. SOMATIC CANTICLES — The trilogy
    {
        "id": "06-somatic-canticles",
        "title": "Somatic Canticles — Sci-Fi Trilogy",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Creative Director creating a cinematic product shot of the Somatic Canticles sci-fi trilogy.

Three books arranged in overlapping cascade on matte Void Black (#070B1D) surface. Each book in matte black cloth binding with Sacred Gold (#C5A017) hot-foil lettering on spines: "ANAMNESIS ENGINE" / "THE MYOCARDIAL CHORUS" / "THE RIPENING" in Panchang font, wide tracking. Front covers: the resonance pattern sigil blind-embossed (black on black, visible only through light angle). Pages are warm Parchment (#F0EDE3) stock with deckle edges. Sewn binding visible. Coherence Emerald (#10B5A7) bookmark ribbons.

The middle book slightly open revealing: a Sacred Gold compass diagram with four directions (STABILIZE, HEAL, CREATE, MUTATE) and engine names radiating from center. Body text in Satoshi at generous margins.

Dark-field studio lighting. Books emerge from darkness. Sacred Gold warm highlights on foil spines. Parchment glow from open pages. Faint Kha Arc gradient atmosphere. No decoration beyond the books. 8K macro detail on cloth texture, foil, page edges."""
    },

    # 7. FINANCIAL BIOSENSOR — Decision reflection
    {
        "id": "07-financial-biosensor",
        "title": "Financial Biosensor — Decision Reflection",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Data Visualization Designer creating a dashboard concept for the Tryambakam Noesis Financial Biosensor — where sacred geometry overlays financial data for decision reflection.

Dark dashboard interface on Void Black (#070B1D). Center: a large mandala-form data visualization with concentric rings showing HRV data (heartbeat waveform in Coherence Emerald #10B5A7), planetary transits (orbital arcs in Flow Indigo #0B50FB), and biorhythm cycles (sine waves in Sacred Gold #C5A017). The four compass directions at cardinal points.

Left panel: vertical bars showing engine states — 6 active engines highlighted in Sacred Gold, others in Muted Silver (#8A9BA8). Labels in SF Mono.
Right panel: decision clarity score as a circular gauge with Coherence Emerald fill.
Bottom: timeline with three overlapping biorhythm waves (Physical, Emotional, Intellectual).

All on Deep Surface (#0E1428) card backgrounds with 1px Muted Silver borders. Typography: Panchang for headers, Satoshi for body, SF Mono for data. Bioluminescent data glow. No external light. Technical precision. 8K quality."""
    },

    # 8. WITNESS AGENTS — Pichet and Aletheos
    {
        "id": "08-witness-agents",
        "title": "Witness Agents — Pichet and Aletheos",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Concept Artist creating a diptych of the two Witness Agents: Pichet (Structure/Discipline) and Aletheos (Flow/Emergence).

Split composition on Void Black (#070B1D) — left half and right half separated by a thin Sacred Gold (#C5A017) vertical line.

LEFT (Pichet — Structure): Geometric, crystalline, architectural. A columnar form built from stacked sacred geometry — precise, ordered, gravitational. Rendered in Sacred Gold wireframe on deep Witness Violet (#2D0050) atmosphere. Sharp angles. Grid-locked. The aesthetic of structural engineering meets sacred architecture. Below: "PICHET" in Panchang, "Structure · Discipline" in Satoshi.

RIGHT (Aletheos — Flow): Fluid, organic within geometric bounds. A form built from flowing sacred geometry — spirals, waves, Fibonacci curves — but still precise, still geometric. Rendered in Coherence Emerald (#10B5A7) bioluminescent wireframe on deep Flow Indigo (#0B50FB) atmosphere. Graceful but mathematical. Below: "ALETHEOS" in Panchang, "Flow · Emergence" in Satoshi.

Both forms abstract — NOT humanoid. Architectural. The duality is structural, not figurative. Dark-field. 8K quality."""
    },

    # 9. INITIATION PROTOCOLS — .init
    {
        "id": "09-initiation-protocols",
        "title": "Initiation Protocols — .init",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Motion Graphics Designer creating a still frame from the .init protocol visualization — the micro-rituals that mark thresholds between practice states.

Void Black (#070B1D) canvas. Center: a breath visualization — a 4:7:8 ratio waveform rendered as a luminous Sacred Gold (#C5A017) sine wave with amplitude markers. The waveform transitions through three phases visible left to right: inhale (4 beats, ascending), hold (7 beats, plateau with subtle Witness Violet #2D0050 glow), exhale (8 beats, descending into Coherence Emerald #10B5A7).

Around the waveform: concentric circles expanding outward like ripples — the resonance pattern sigil geometry radiating from the breath center. Each ripple a thinner, more transparent Sacred Gold line.

At top: ".init" in SF Mono, Sacred Gold. Below: "Micro-ritual · Macro-transformation" in Satoshi, Parchment (#F0EDE3).

Constellation grid visible in background at 10% opacity. The visualization feels like a heartbeat rendered as sacred geometry. Precise, rhythmic, structural. Dark-field. 8K."""
    },

    # 10. INFINITE TREASURE — The four quadrants
    {
        "id": "10-infinite-treasure",
        "title": "Infinite Treasure — Dharma Artha Kama Moksha",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Brand Designer creating a four-quadrant compass map for the "Infinite Treasure" — the four life quadrants: Dharma (purpose), Artha (prosperity), Kama (fulfillment), Moksha (liberation).

A large compass rose on Void Black (#070B1D) — but rendered as a treasure map meets architectural blueprint. Four quadrants:

NORTH (Dharma/Purpose): Sacred Gold (#C5A017) dominant. Geometric patterns suggesting archaeological excavation — layered strata revealing structure. "DHARMA" in Panchang.

EAST (Artha/Prosperity): Coherence Emerald (#10B5A7) dominant. Geometric patterns suggesting material infrastructure — load-bearing beams, foundations. "ARTHA" in Panchang.

SOUTH (Kama/Fulfillment): Flow Indigo (#0B50FB) dominant. Geometric patterns suggesting sensory richness — acoustic waveforms, resonance patterns. "KAMA" in Panchang.

WEST (Moksha/Liberation): Witness Violet (#2D0050) dominant. Geometric patterns suggesting dissolution — geometry becoming increasingly transparent, releasing form. "MOKSHA" in Panchang.

Center: the resonance pattern sigil with all four colors converging. Compass lines connecting quadrants. Constellation grid throughout. Dark-field. Cartographic precision. 8K."""
    },

    # 11. THE APOTHECARY — Physical ritual objects
    {
        "id": "11-apothecary",
        "title": "The Apothecary — Bioalchemy",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Product Photographer creating a dark-field knolling composition of the Tryambakam Noesis Apothecary collection.

Overhead view on matte Void Black (#070B1D) surface. Objects arranged in golden ratio spacing:

1. Three amber glass tincture bottles (medicinal mushroom dual-extracts) with brushed bronze dropper caps, Sacred Gold (#C5A017) etched sigils on glass
2. Bundle of hand-selected sage tied with dark cord, beside an unglazed dark ceramic incense holder with impressed resonance pattern
3. Small amber glass essential oil vial with bronze cap, engine name "CHRONOFIELD" etched in SF Mono
4. Bronze orgonite pyramid with Coherence Emerald (#10B5A7) resin core glowing from within
5. Dark leather pouch with blind-embossed sigil, partially open revealing dried botanical material

A faint Sacred Gold constellation grid drawn between objects on the surface — connecting them geometrically.

Single directional warm light from upper-left. Sacred Gold highlights on bronze and amber glass. Coherence Emerald glow from orgonite. Deep shadows. No greenery. No lifestyle context. Objects emerge from darkness. 8K macro detail on material textures — bronze grain, glass, ceramic pores, leather fiber."""
    },

    # 12. THE FIRST RULE — You are the code
    {
        "id": "12-first-rule",
        "title": "The First Rule — You Are The Code",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Typographic Designer creating a manifesto poster for "The First Rule of Self-Consciousness: Witness Without Identification."

Void Black (#070B1D) canvas. Center: large typographic composition in Panchang display font:

"YOU ARE THE CODE" — Sacred Gold (#C5A017), massive scale
"YOU ARE THE CODER" — Parchment (#F0EDE3), slightly smaller
"YOU ARE THE RUNTIME" — Coherence Emerald (#10B5A7), same scale as second line

Below, separated by a thin Sacred Gold line:
"Witness without identification." — Satoshi italic, Muted Silver (#8A9BA8)

Behind the text: the resonance pattern sigil rendered at enormous scale, very subtle — Sacred Gold wireframe at 8% opacity. The geometry is there but doesn't compete with the typography.

Constellation grid at edges, 5% opacity. The poster has the weight of a thesis statement — not inspirational quote. Architectural typographic design. Swiss grid influence. Sharp edges. Dark-field. 8K."""
    },

    # 13. BEGIN JOURNEY — Call to action
    {
        "id": "13-begin-journey",
        "title": "Begin Journey — The Oasis Awaits",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Art Director creating the closing hero image for the Tryambakam Noesis website — "Begin Journey."

A vast Void Black (#070B1D) landscape stretching to a distant horizon line. At the horizon: a Coherence Emerald (#10B5A7) bioluminescent glow — like dawn breaking, but in emerald, not orange. The glow illuminates a constellation grid that stretches across the entire ground plane in Sacred Gold (#C5A017) at 15% opacity — an infinite geometric field.

In the foreground: a single path marked by thin Sacred Gold lines converging toward the horizon glow. The path follows Fibonacci spiral proportions.

Above the horizon: the resonance pattern sigil, enormous, rendered as Sacred Gold wireframe against deep Kha Arc gradient sky (#070B1D → #2D0050 → #0B50FB). Stars visible as constellation points.

The composition draws the eye forward — the journey, not the destination. Cinematic. Atmospheric depth. Dark-field principle: light from within, not projected. 8K quality. The sublime through geometry."""
    },

    # 14. THE PLUMBER — Manga series
    {
        "id": "14-plumber",
        "title": "The Plumber — Manga Episode Cover",
        "size": "portrait_4_3",
        "prompt": f"""{BRAND_CONTEXT}
Act as Manga Artist creating an episode cover for "The Humble Psychic Plumber" — the axis mundi figure, the vertebral pole as consciousness spine.

A solitary figure seen from behind, standing at the base of a vast vertebral column rising like a spinal axis through layered concentric sacred geometry into deep Void Black (#070B1D) space. The figure rendered in minimalist black-and-white manga style — clean linework, flat Parchment (#F0EDE3) tones, sharp shadows. Structured minimal clothing. Feet planted firmly.

The vertebral column rendered as anatomical precision — each vertebra distinct, with Sacred Gold (#C5A017) wireframe sacred geometry radiating outward from the spine at each vertebral level. Geometry increases in complexity as it rises — simple compass at lumbar, full mandala at cervical, the resonance pattern sigil at crown.

No mystical imagery, no lotus cliche, no third eye — the sublime is in the anatomy. The architecture of the body IS the sacred geometry. Faint constellation grid at edges. Title: "THE PLUMBER — EPISODE I" in Panchang, Sacred Gold at top. 8K."""
    },

    # 15. NOESIS DASHBOARD — The digital interface
    {
        "id": "15-noesis-dashboard",
        "title": "Noesis Dashboard — 16 Mirrors",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as UI/UX Designer creating a mockup of the Noesis Dashboard — where sixteen perceptual lenses converge into a coherent field.

Desktop dashboard on Void Black (#070B1D). Central visualization: a circular radar-chart-like display with 16 radial axes — one per engine. Each axis shows a different data metric rendered in the Consciousness Color Spectrum. Active engines pulse with Sacred Gold (#C5A017). Coherence Emerald (#10B5A7) rings show synthesis zones.

Left sidebar: engine list with status indicators (Sacred Gold = active, Muted Silver = standby). Current compass reading: "HEAL — Southeast" in SF Mono.
Top bar: "NOESIS DASHBOARD" in Panchang. User's consciousness level indicator: "Phase 2 — Practicing" in Satoshi.
Right panel: today's witness prompt in a Deep Surface (#0E1428) card: "What might this pattern be protecting?" in Satoshi italic.
Bottom: three biorhythm sine waves (Physical/Emotional/Intellectual) as a timeline.

All Deep Surface card backgrounds. 1px Muted Silver borders. SF Mono for data. Bioluminescent data glow. Technical, precise, beautiful. 8K."""
    },

    # 16. KHA-BA-LA COMPASS — Navigation system
    {
        "id": "16-compass",
        "title": "Kha-Ba-La Compass — Four Directions",
        "size": "square",
        "prompt": f"""{BRAND_CONTEXT}
Act as Cartographic Designer creating the Kha-Ba-La Compass — the navigation system for the 16 engines across 4 directions.

A large compass rose on Void Black (#070B1D) — architectural, not decorative. Four cardinal directions:

NORTH — "STABILIZE" in SF Mono, Sacred Gold (#C5A017). Geometric pattern: stacked horizontal lines suggesting grounding.
EAST — "HEAL" in SF Mono, Coherence Emerald (#10B5A7). Geometric pattern: concentric healing circles.
SOUTH — "CREATE" in SF Mono, Flow Indigo (#0B50FB). Geometric pattern: radiating generative lines.
WEST — "MUTATE" in SF Mono, Witness Violet (#2D0050). Geometric pattern: transforming, shifting geometry.

Center: the resonance pattern sigil — nested sacred geometry with lotus-form core. Sacred Gold wireframe, Coherence Emerald bioluminescent glow from center.

Between cardinal points: the 16 engine names arranged in their compass positions, in Parchment (#F0EDE3) micro-text. Constellation grid connecting everything. Dark-field. Precision cartographic rendering. 8K."""
    },

    # 17. MENTORSHIP CRESCENDO — The four stages
    {
        "id": "17-mentorship",
        "title": "Mentorship Crescendo — Dharma to Moksha",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Editorial Designer creating a visual progression for the Mentorship Crescendo — four stages of a fully authored life.

Four ascending panels on Void Black (#070B1D), connected by a thin Sacred Gold (#C5A017) ascending line — like a musical crescendo marking.

Panel 1 (DHARMA — What is your actual work?): Sacred Gold dominant. An archaeological excavation diagram — layered strata with geometric artifacts being uncovered. Dense, grounded, material.

Panel 2 (ARTHA — What sustains it?): Coherence Emerald (#10B5A7) dominant. An architectural blueprint — load-bearing structures, foundations, infrastructure rendered as sacred geometry.

Panel 3 (KAMA — What fulfills it?): Flow Indigo (#0B50FB) dominant. Acoustic waveforms and resonance patterns — sensory richness rendered as geometric frequency analysis.

Panel 4 (MOKSHA — What transcends it?): Witness Violet (#2D0050) dominant. Geometry dissolving into constellation points — form releasing into field. Liberation through completion.

Each panel labeled in Panchang. The crescendo line connects them all. Dark-field. Architectural. 8K."""
    },

    # 18. SOULBOUND TOKEN — Digital credential
    {
        "id": "18-soulbound-token",
        "title": "Soulbound Token — Progressive Revelation",
        "size": "square",
        "prompt": f"""{BRAND_CONTEXT}
Act as 3D Product Designer creating a visualization of the Tryambakam Noesis Soulbound Token — a non-transferable digital credential that evolves with practice depth.

A cast bronze disc floating on Void Black (#070B1D), tilted at 15 degrees to show dimensional depth. The disc surface: the resonance pattern sigil rendered in high relief — nested sacred geometry with compass points and lotus core. Sacred Gold (#C5A017) patina on raised surfaces, darker oxidation in recessed geometry.

Around the rim: "TRYAMBAKAM NOESIS" engraved in Panchang font. The four compass directions at cardinal points in micro-engraved SF Mono. The disc has temple-architecture weight.

A Coherence Emerald (#10B5A7) bioluminescent glow emanating from the lotus core — as if the bronze itself carries light. Progressive revelation visualized: faint geometric layers visible beneath the surface, suggesting deeper patterns that emerge over time.

Dark leather surface beneath. Single warm directional light from above. Sacred Gold specular highlights on curved bronze edges. 8K macro detail on patina, relief, engraving."""
    },

    # 19. CONSTELLATION FIELD — Background texture
    {
        "id": "19-constellation-field",
        "title": "Constellation Field — Network of Witness",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Generative Art Designer creating a vast constellation field — the background texture of the Tryambakam Noesis universe.

Full-frame Void Black (#070B1D) canvas. Hundreds of Sacred Gold (#C5A017) constellation points — tiny luminous dots — connected by hairline threads at 15-30% opacity. The connections form emergent sacred geometry patterns at different scales: small triangles, larger pentagons, vast hexagonal structures.

At certain node intersections, subtle Coherence Emerald (#10B5A7) bioluminescent glows — brighter nodes where multiple connections converge. A few nodes pulse with Witness Violet (#2D0050).

The overall pattern suggests both a star map and a neural network — cosmos and consciousness as the same topology. No single focal point — the entire field IS the composition. The depth is created through varying opacity and brightness of connections.

Vast, meditative, mathematical. The beauty of emergent pattern. Dark-field. The darkness between connections is as important as the connections. 8K quality. Suitable as a repeating background texture."""
    },

    # 20. BRAND KIT BENTO — Identity system overview
    {
        "id": "20-brand-bento",
        "title": "Brand Kit Bento — Identity System",
        "size": "landscape_16_9",
        "prompt": f"""{BRAND_CONTEXT}
Act as Lead Brand Designer creating a comprehensive Brand Identity System bento-grid presentation for Tryambakam Noesis.

Single high-resolution bento-grid board containing 6 distinct modules:

Block 1 (Hero — largest): Void Black (#070B1D) canvas. Resonance pattern sigil in Sacred Gold (#C5A017) wireframe with Coherence Emerald (#10B5A7) bioluminescent core. Kha Arc gradient atmospheric background. "TRYAMBAKAM NOESIS" wordmark in Parchment (#F0EDE3), Panchang font, wide tracking.

Block 2 (Social): Void Black with constellation grid at 5%, centered "Self-Consciousness as Technology." in Panchang, Parchment text. Sacred Gold accent line below.

Block 3 (Palette): 5 vertical color swatches: Void Black, Witness Violet #2D0050, Flow Indigo #0B50FB, Sacred Gold #C5A017, Coherence Emerald #10B5A7. HEX codes in SF Mono.

Block 4 (Typography): "Panchang" in display font. "Satoshi" in body font. Golden ratio scale hierarchy.

Block 5 (Sigil): Clean resonance pattern — Sacred Gold on Void Black. Coherence Emerald glow from center.

Block 6 (Brand DNA): "ARCHETYPE: The Anatomist Who Sees Fractals. VOICE: Grounded, direct, respectful-challenging. FRAMEWORK: Kha-Ba-La."

Behance/Awwwards. 8K. Sharp edges. 1px Muted Silver (#8A9BA8) borders. Generous negative space. Bioluminescent."""
    },
]


def generate_image(prompt_data, retries=3):
    """Call FAL AI nano-banana-pro and save the image."""
    img_id = prompt_data["id"]
    output_path = OUTPUT_DIR / f"{img_id}.png"

    if output_path.exists():
        print(f"  ⏭ {img_id} already exists, skipping")
        return True

    payload = json.dumps({
        "prompt": prompt_data["prompt"],
        "negative_prompt": NEGATIVE,
        "image_size": prompt_data["size"],
        "num_inference_steps": 40,
        "guidance_scale": 7.5,
    }).encode("utf-8")

    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json",
    }

    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                "https://fal.run/fal-ai/nano-banana-pro",
                data=payload,
                headers=headers,
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read())

            image_url = result.get("images", [{}])[0].get("url")
            if not image_url:
                print(f"  ⚠ No image URL for {img_id}, attempt {attempt+1}")
                continue

            # Download image
            img_req = urllib.request.Request(image_url)
            with urllib.request.urlopen(img_req, timeout=60) as img_resp:
                img_data = img_resp.read()

            with open(output_path, "wb") as f:
                f.write(img_data)

            size_kb = len(img_data) / 1024
            print(f"  ✅ {img_id} — {size_kb:.0f}KB")
            return True

        except Exception as e:
            print(f"  ⚠ {img_id} attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(5)

    print(f"  ❌ {img_id} FAILED after {retries} attempts")
    return False


def main():
    print(f"🎨 Generating {len(WING_PROMPTS)} wing images via FAL AI nano-banana-pro")
    print(f"📁 Output: {OUTPUT_DIR}\n")

    success = 0
    failed = 0

    for i, prompt_data in enumerate(WING_PROMPTS):
        print(f"[{i+1}/{len(WING_PROMPTS)}] {prompt_data['title']}")
        if generate_image(prompt_data):
            success += 1
        else:
            failed += 1
        # Small delay between requests
        if i < len(WING_PROMPTS) - 1:
            time.sleep(2)

    print(f"\n{'='*50}")
    print(f"✅ Success: {success} | ❌ Failed: {failed} | Total: {len(WING_PROMPTS)}")
    print(f"📁 Images at: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
