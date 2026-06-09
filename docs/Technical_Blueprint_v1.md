# Technical Blueprint

Core, Entities, Systems.

## Current Upgrade State

- Core loop: the game continues to run through the existing frame update path in src/core/game.js.
- Fragments: ambient drift is currently gated by cycle count in src/entities/fragment.js.
- Q: the visual identity is intentionally simplified to a pulsing sphere in src/entities/q.js.
- Observer: glyph expression for desync is handled in src/entities/observer.js.

## Verification Notes

When revisiting the project, verify:
1. syntax with node --check on affected modules;
2. runtime load in the browser;
3. the cycle-3 drift timing and the visible fragment behavior.
