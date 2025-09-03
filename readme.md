# Country Guessing Game (FlagsAPI)

A simple, browser-based country-guessing game that uses flags from FlagsAPI (https://flagsapi.com) and country data from Rest Countries or a local HTML copy. The player sees a flag and chooses the correct country name from 4 options. Score is tracked between rounds.

---

## Quick start

1. Open `index.html` in a modern browser (or serve the folder with a simple static server).
2. The app will try to fetch country data from the Rest Countries API. If offline or blocked, it falls back to the local copy (`ccopiedhtml.html`) or an internal list.
3. Click one of the four choices under the flag to guess. Correct answers increase the score. Click "Next" to play another round.

Recommended: serve the folder using a static server (e.g. `npx http-server` or `python -m http.server`) to avoid local file fetch restrictions.

---

## Project structure

- index.html — Game UI.
- styles.css — Styling for layout and feedback.
- index.js — Game logic (loads country list, builds rounds, handles scoring).
- countries.js — Country list loader (RestCountries → local HTML → fallback array).
- ccopiedhtml.html — Local HTML copy of country codes/names (used as backup).
- README.md — This file.

---

## Key features (current)
- Single-flag quiz with 4 options (1 correct + 3 distractors).
- Score tracking.
- Robust country source: Rest Countries API, local HTML parse, and fallback list.
- Flag images loaded from FlagsAPI (alpha-2 codes, `flat` style).
- Error handling for missing flags (inline SVG placeholder).

---

## UX / Technical improvements to add (future features)
- Difficulty levels: Easy (common countries), Hard (less-known countries), Region filters.
- Timed rounds: add countdown per question with bonus scoring.
- Streaks and level progression with badges/achievements.
- Hints system: show region, capital, or outline; limited uses per round.
- Localization (multiple UI languages) and improved country name normalization.
- Offline mode: bundle flags and country data for a PWA with service worker.
- Accessibility improvements (keyboard navigation, ARIA labels, high-contrast theme).
- Analytics & telemetry: track popular countries / drop-off rates (with privacy mode).
- Multiplayer/duels API: real-time matches using WebSockets.
- Leaderboards using a backend (optionally OAuth) and per-region leaderboards.
- Theming and skin packs (paid themes).

---

## Monetization ideas
- Ads
  - Integrate non-intrusive ads (banner or rewarded video) via reputable ad networks.
  - Rewarded ads: let players watch a short ad for a hint or extra life.
- Freemium / Premium
  - Offer a paid ad-free version and additional features (detailed stats, more game modes).
  - Sell season passes with exclusive challenges and badges.
- In-app purchases
  - One-off hint purchases, theme packs, or flag bundles.
- Affiliate / Partnerships
  - Partner with travel/education services; add contextual links (e.g., learn more about the country).
- White-label / Licensing
  - License the game to educational platforms or embed as a widget on language-learning sites.
- Sponsorship / Branded content
  - Custom quizzes for brands, events, or geography campaigns.
- Data & Insights (respect privacy rules)
  - Offer anonymized usage insights to educational partners.

---

## For developers

- Add countries.js before index.js in `index.html` to ensure data loader is available.
- To change flag size/style: update the FlagsAPI URL in `index.js` (`flat/64.png`).
- To limit the country pool (e.g., region-only): filter the array returned by `getCountries()`.

Example: show only Europe
```
const europe = countries.filter(c => c.name && /* your region check */);
```

---

## Contribution & License

Contributions welcome: open an issue or PR with improvements, bug fixes, or feature suggestions.

This repository is provided as-is for learning and prototyping. Add a license (MIT/Apache) if you intend to distribute commercially.

---

## Notes & privacy

- Flags and some country data are fetched from third-party APIs — respect their terms.
- If you add analytics or login features, update the README with privacy and data-handling notes.

Enjoy building — GitHub Copilot

