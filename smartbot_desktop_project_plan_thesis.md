# Smartbot Desktop — Project Plan & Thesis

## Project Thesis
Smartbot is conceived as a **local-first, evolving companion system** anchored in SMART Recovery principles. Unlike typical apps, Smartbot is not a static tool but a **living system** that co-adapts with the user. It uses reinforcement learning with *happiness and flourishing* as its fitness function, expressed through improved coping, self-management, and balance in life.

The guiding ideas are:
- **Holistic Artificial Life**: Software treated as a lifeform with perception, memory, adaptation, and phenotype (UI) that morphs with user needs.
- **Humanistic Anchors**: Draws from Rogers, Adler, and Sullivan, with SMART Recovery providing the actionable scaffolding.
- **Golden Rule++**: Ethical baseline extended to all beings and the environment, ensuring nudges enhance sustainable flourishing.
- **Firm but Kind Counselor**: Acts like a motivational interviewing coach—directive when needed, but always empowering.
- **Local & Private**: Runs close to the user (desktop/phone), with no data leaving the device by default.

---

## Guiding Ideas
1. **Evolving Companion**: Smartbot adapts daily interactions through a contextual bandit loop, learning which tools are most effective for the user in different states.
2. **SMART Recovery Toolkit**: Implements the 4-point program:
   - Building & maintaining motivation (CBA, Values review)
   - Coping with urges (Urge log, If-Then, Breathing)
   - Managing thoughts/feelings/behaviors (ABCD worksheets)
   - Living a balanced life (VACI planner)
3. **UI Morphogenesis**: Three adaptive modes—Crisis, Growth, and Flow—each shaping the interface to match the user’s context.
4. **Ethics & Guardrails**: Prevents shallow optimization (e.g., dopamine chasing) by grounding interventions in transparent rationale and ecological ethics.
5. **Local-First Privacy**: Journaling, mood logs, and personal data are stored securely on-device, encrypted, and explainable.

---

## Project Plan

### Phase 1: Foundation (Weeks 1–2)
- Scaffold Tauri + React desktop app with FastAPI backend.
- Implement journaling, urge log, and check-in components.
- Wire `/choose` and `/learn` endpoints to contextual bandit.
- Add Vitest tests for feature encoding and smoke tests.

### Phase 2: SMART Tools (Weeks 3–4)
- Build CBA, ABCD, VACI, If-Then, and Breathing forms.
- Connect tools to feedback loop: ΔSUDS, completion, regret.
- Add context signals: mood, workload, sleep, streak.
- Begin explainability: show why a recommendation was made.

### Phase 3: Adaptive UI & Modes (Weeks 5–6)
- Implement Crisis, Growth, and Flow layouts.
- Add state machine to govern transitions.
- Provide transparency: explain mode switch rationale.
- Introduce streak tracking and weekly reviews.

### Phase 4: Ethics & Security (Weeks 7–8)
- Integrate SQLCipher for encrypted local storage.
- Build consent management UI.
- Bake in Golden Rule++ guardrails.
- Add export/delete-all functionality for user control.

### Phase 5: Polishing & Release (Weeks 9–10)
- Enhance UI with Tailwind + animations.
- Optimize bandit exploration/exploitation balance.
- Add more SMART worksheets and motivational prompts.
- Package with Tauri for cross-platform distribution.

---

## Deliverables
- **Functional Desktop App** (Tauri + React + FastAPI core).
- **SMART Toolkit Integration** (5 core tools, adaptive interface).
- **Explainability Module** (nudges with reasons).
- **Tests & CI** (Vitest, GitHub Actions).
- **Documentation** (thesis, guiding ideas, ADRs).

---

## Long-Term Vision
- Extend to mobile (Flutter or Swift/Kotlin forks).
- Add lightweight personalization with on-device LoRA adapters.
- Enable optional secure sync between devices.
- Expand to a broader “wisdom engine” that guides not just recovery but flourishing across life domains.

---

**Smartbot is more than software: it is a living companion that nudges toward self-directed growth, sustainable happiness, and ethical flourishing.**

