# Selemene website deployment receipt

Observed2026-09-30 session date. Live page: https://www.tryambakam.space/selemene/

## Source and target

- Repository: Sheshiyer/tryambakam-space; branch codex/selemene-plugin-pages.
- Deployed source commit:6feceab. Base4a33451fc092b2f23eea81487f36ca0dbb412a35 was independently verified as the previously deployed production source.
- Project:tryambakam-space in sheshiyers-projects; IDprj_It3eejxU1cGWz0hev1X2lyEQrHVG.
- Previous deployment:dpl_Ed4nwrKTpqobFGvTXUepYwFZcyy1.
- New deployment:dpl_9YMGkwHxcV3C8ZTjtP5jABfyeBuS.
- Immutable URL:https://tryambakam-space-3ptpmqsxm-sheshiyers-projects.vercel.app

The user approved the draft and requested the MotionSkin/MotionSites website. The new deployment contains the Selemene pages and their assets, with the original umbrella application source unchanged. The landing and readings pages describe ChatGPT integration as in preparation. Privacy, terms and support retain explicit draft status and noindex; publication of these draft pages is not approval of effective legal policies.

## Release and checks

Vercel linked the existing project, deployed with --prod --skip-domain, and passed its hosted build:674modules,10.70second Vite build,25second total build. Existing main-app Three chunk warning remains.

The candidate was accessed through authenticated vercel curl. The CLI automatically generated a deployment-protection bypass token for this project; no value was displayed or saved in project source/evidence. Project protection settings were not disabled. Candidate HTML, motion.js and Lenis bytes matched source; JavaScript assets had application/javascript MIME types.

After candidate checks, vercel promote successfully assigned the production domains to the exact new deployment. live-site-checks.json records ten unauthenticated public checks: all five pages plus motion/runtime/sigil assets return200 and match source byte for byte. JavaScript MIME types are correct.

Parent IAB public-domain verification confirmed five panels, rendered canvas, scroll-driven sigil approach, desktop1408px and mobile390px without horizontal overflow. Earlier final-source local checks covered all five pages at390px and1280px, mobile focus/escape behavior, pause/native scrolling, live and initial reduced-motion settings, no-JS and blocked-module fallbacks. Browser test overrides were restored and the public site remains open as a deliverable.

Screenshot artifacts are saved outside the repository in the task visualizations directory:selemene-live-desktop.png,selemene-live-sigil.png,selemene-live-mobile.png.

## Rollback

For an application regression, promote previous exact deployment dpl_Ed4nwrKTpqobFGvTXUepYwFZcyy1 in scope sheshiyers-projects. This rolls back this website independently of the Selemene MCP Worker. Preserve Git branch/source evidence; do not reset unrelated work.

## Remaining acceptance

Publisher/contact, retention/deletion commitments, effective policy approval, real ChatGPT account connection, recorded demo and public plugin submission remain outstanding. Website publication does not establish them.
