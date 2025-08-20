# Smartbot — Contributor Onboarding & Workflow

Welcome! This guide walks you from first clone to your first merged PR for **Smartbot**.

> Target repo: **https://github.com/abandini/smartbot**

---

## 1) Prerequisites
- **Git** ≥ 2.40
- **Node.js** ≥ 20 (includes npm)
- **Python** ≥ 3.11 + `pip`
- **Rust** (for Tauri) → install via https://rustup.rs
- **Tauri deps**: platform-specific build tools (Xcode CLT for macOS; MSVC for Windows; GTK/WebKit for Linux)

Optional (recommended):
- **pnpm** (fast installs) → `npm i -g pnpm`
- **uv** or **virtualenv** for Python venv management

---

## 2) Repository Setup (HTTPS or SSH)

### A. Clone (HTTPS)
```bash
git clone https://github.com/abandini/smartbot.git
cd smartbot
```

### B. Clone (SSH)
```bash
git clone git@github.com:abandini/smartbot.git
cd smartbot
```

### Configure upstream (if you forked first)
```bash
git remote add upstream https://github.com/abandini/smartbot.git
# or: git remote add upstream git@github.com:abandini/smartbot.git
git fetch upstream
```

---

## 3) Branching Strategy
Use **trunk-based** development with short-lived feature branches.

- Base branch: `main`
- Feature branches: `feat/<area>-<short-title>`
- Fix branches: `fix/<area>-<short-title>`

Create your branch:
```bash
git checkout -b feat/ui-vaci-planner
```

Keep up to date while working:
```bash
git fetch origin
git rebase origin/main
```

---

## 4) Local Development

### A. FastAPI Core (backend)
```bash
# from repo root
cd template
python -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn pydantic numpy
uvicorn template.core.main:app --reload
```
The core exposes:
- `POST /choose` → returns `{ action, ui_mode }`
- `POST /learn`  → accepts feedback and updates bandit

### B. Desktop UI (Tauri + React)
```bash
cd ../targets/desktop-tauri/app/ui
npm i
npm run dev       # Vite dev server
# In another terminal, optional Tauri shell:
# npm run tauri:dev
```

### C. Tests (frontend)
```bash
npm run test
```

---

## 5) Commit Style & Messages
- Follow conventional style **loosely**:
  - `feat(ui): add VACI form`
  - `fix(core): clamp SUDS range`
  - `chore(ci): add vitest workflow`
- Keep commits **atomic** and **scoped**. Include brief rationale.

Stage and commit:
```bash
git add -A
git commit -m "feat(ui): implement VACI planner with tests"
```

---

## 6) Push & Open a Pull Request

First push of a new branch:
```bash
git push -u origin feat/ui-vaci-planner
```
Then open a PR on GitHub targeting `main`.

**PR checklist** (copy into PR description):
- [ ] Feature works locally (UI & core)
- [ ] Tests added/updated (`npm run test` passes)
- [ ] No secrets or private data in commits
- [ ] Aligned with SMART 4-point mapping
- [ ] Includes brief explanation of trade-offs/choices

---

## 7) Directory Layout (high level)
```
smartbot/
  template/                 # FastAPI core (LinUCB bandit, reward)
  targets/
    desktop-tauri/
      app/ui/               # React + Tailwind + Vitest
      src-tauri/            # Tauri shell (Rust)
  models/                   # Model conversion scripts & artifacts
  docs/                     # Project docs, ADRs, thesis, onboarding
```

---

## 8) Code Quality
- **TypeScript**: prefer explicit types; avoid `any`.
- **React**: functional components, hooks, small composable pieces.
- **Tailwind**: meaningful utility stacks; avoid inline magic numbers.
- **Testing**: add **Vitest** unit tests for logic and at least one **smoke** test per new UI area.

---

## 9) Environment & Secrets
- No secrets are required for local dev.
- Never commit tokens, keys, or personal data.
- If adding system-level integrations later, read from `.env.local` (gitignored) and document variables.

---

## 10) CI Expectations
- CI should run lint/tests on PRs (frontend initially).
- Future: add **Pytest** for backend and **Playwright** for E2E.

---

## 11) Versioning & Releases
- Use tags like `desktop-v0.1.0`.
- Tauri builds produced via `npm run tauri:build`.
- Changelogs can be generated from commit messages.

---

## 12) Troubleshooting
- **Port conflicts (5173/8000)**: stop other dev servers or change ports in `vite.config.ts` / uvicorn args.
- **Rust/Tauri build errors**: ensure Rust toolchain installed and platform deps satisfied.
- **Type errors**: run `npm run test` to catch early; ensure TS types align with component props.

---

## 13) Common Commands (Cheat Sheet)
```bash
# sync main
git fetch origin && git rebase origin/main

# run backend
cd template && source .venv/bin/activate && uvicorn template.core.main:app --reload

# run UI
yarn dev # or: npm run dev

# run tests
npm run test

# push branch
git push -u origin <branch>
```

---

## 14) Example: Add a New SMART Tool (VACI)
1. Create component: `targets/desktop-tauri/app/ui/src/components/tools/VACIForm.tsx`
2. Add test: `targets/desktop-tauri/app/ui/src/components/tools/VACIForm.test.tsx`
3. Wire into `App.tsx` with `onComplete` → call `/learn`.
4. Run `npm run test` and manual check in the UI.
5. Commit & push:
```bash
git checkout -b feat/ui-vaci-planner
git add -A
git commit -m "feat(ui): VACI planner w/ tests and learn hook"
git push -u origin feat/ui-vaci-planner
```
6. Open PR → pass checklist → request review.

---

## 15) Contributor Etiquette
- Keep PRs small (reviewer-friendly).
- Add a short rationale: *why this change?*
- Be explicit about limitations or known gaps.

---

## 16) Contact & Support
- Open a GitHub Discussion for ideas/questions.
- File issues with minimal repro steps and environment details.

---

Happy building! Your contributions help Smartbot become a compassionate, local-first companion that nudges toward sustainable flourishing.

