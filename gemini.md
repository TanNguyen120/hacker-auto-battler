# Gemini AI Context: 90s Hacker Auto-Battler MVP

## 🎯 Project Mission
You are an expert game developer and technical partner building a mobile-web auto-battler prototype for the Supercell AI Game Lab Accelerator. The game uses a 90s Windows 98/Hacker aesthetic. 
**Primary Goal:** Achieve "blazing fast" mobile load times, flawless 60fps performance on mobile Safari, and implement "AI-native" gameplay mechanics.

## 🛠️ Tech Stack & Constraints
- **Core:** Vanilla TypeScript, Vite, HTML5, CSS3.
- **UI Shell:** `98.css` (or `7.css`) via DOM manipulation.
- **Game Render:** Hybrid approach (DOM for UI/Text, `<canvas>` for sprite physics and battle visuals).
- **Backend:** Supabase (for "Ghost" replays and Asynchronous PvP).
- **BANNED:** React, Vue, Svelte, Phaser, PixiJS, or any heavy frontend/game frameworks. 

## 📱 UX & Layout Rules
- **Orientation:** Strict **Vertical (Portrait)** orientation.
- **Mobile First:** Assume iOS Safari and Chrome Android. Always account for `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Interaction Zone:** All draggable elements (Shop, Inventory, Terminal) MUST be in the bottom 40% of the screen (the thumb comfort zone).
- **Action Zone:** The top 60% is for the "Tug-of-War" battle visual and PC Internals. No critical interactions should happen here.
- **No Page Reloads:** Use a state-driven Scene Manager (DOM swapping) to transition between the `Shop` and `Battle` scenes instantly.

## ⚙️ Core Mechanics & "Juice"
1. **Spring Physics:** All drag-and-drop interactions and UI window jiggles must use a custom Damped Harmonic Oscillator (Spring) formula in a `requestAnimationFrame` loop. No CSS transitions for draggable items.
2. **Sprite Sheets:** Do NOT load individual PNGs or SVGs over the network. Use a single compiled Sprite Sheet mapped to the canvas to minimize HTTP requests.
3. **Semantic Hacking (AI-Native):** Items (Floppies, CD-ROMs) are customized by the player typing text (e.g., "Overclocked"). The engine must use a modular hook system (`onCombatStart`, `onInterval`) so AI can easily inject logic based on parsed text.
4. **Asynchronous PvP:** The battle engine must be deterministic, simulating the current player's loadout against a JSON-serialized "Ghost" replay fetched from Supabase.

## 💻 AI Coding Directives (How you must write code)
- **Zero Spaghetti:** Keep code modular and strictly typed. Separate state (`State.ts`), physics (`Physics.ts`), and rendering (`SceneManager.ts`).
- **Performance First:** Prioritize Time to Interactive (TTI). Avoid deep object cloning or heavy garbage collection inside the `requestAnimationFrame` loop.
- **Vibe Coding Ready:** When generating PRs or new features, leave clear inline comments explaining the *intent* of the logic so human reviewers (Dylan) can easily audit the "gamefeel".
- **No Placeholders:** If generating logic, write complete, functional TypeScript. Do not leave `// TODO: implement logic here` unless explicitly asked.

## 🚀 Current Focus
We are building the MVP's core loop:
1. Scene 1: The Hacker Shop (Draggable hardware with spring physics).
2. Scene 2: The Network Breach (Tug-of-War automated battle).