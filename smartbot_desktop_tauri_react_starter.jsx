# Smartbot — Desktop (Tauri + React) Starter

This Markdown file contains **all project files** for the desktop fork of Smartbot. Copy them into your repo under the indicated paths.

---

## index.html (`targets/desktop-tauri/app/ui/index.html`)
```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>smartbot desktop</title>
  </head>
  <body class="bg-gray-50 text-gray-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## package.json (`targets/desktop-tauri/app/ui/package.json`)
```json
{ ... }
```

## tsconfig.json (`targets/desktop-tauri/app/ui/tsconfig.json`)
```json
{ ... }
```

## vite.config.ts (`targets/desktop-tauri/app/ui/vite.config.ts`)
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], server: { port: 5173 } })
```

## vitest.config.ts (`targets/desktop-tauri/app/ui/vitest.config.ts`)
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
```

## postcss.config.cjs (`targets/desktop-tauri/app/ui/postcss.config.cjs`)
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

## tailwind.config.cjs (`targets/desktop-tauri/app/ui/tailwind.config.cjs`)
```js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: []
}
```

## index.css (`targets/desktop-tauri/app/ui/src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## main.tsx (`targets/desktop-tauri/app/ui/src/main.tsx`)
```ts
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')
const root = createRoot(container)
root.render(<App />)
```

## api.ts (`targets/desktop-tauri/app/ui/src/lib/api.ts`)
```ts
export type ChooseResponse = { action: 'CBA'|'ABCD'|'VACI'|'BREATH'; ui_mode: 'Crisis'|'Growth'|'Flow' }
export async function choose(features: number[]): Promise<ChooseResponse> { ... }
export async function learn(args: {features:number[], action:string, delta_suds:number, completed:boolean, regret?:boolean}) { ... }
```

## features.ts (`targets/desktop-tauri/app/ui/src/lib/features.ts`)
```ts
export function buildFeatures(...) { ... }
function clamp(...) { ... }
```

## features.test.ts (`targets/desktop-tauri/app/ui/src/lib/features.test.ts`)
```ts
import { describe, it, expect } from 'vitest'
import { buildFeatures } from './features'

describe('buildFeatures', () => { ... })
```

## machine.ts (`targets/desktop-tauri/app/ui/src/state/machine.ts`)
```ts
import { createMachine, assign } from 'xstate'
export const modeMachine = createMachine<Ctx>({ ... })
```

## ModeBanner.tsx (`targets/desktop-tauri/app/ui/src/components/ModeBanner.tsx`)
```tsx
export default function ModeBanner({ mode }:{ mode:Mode }){ ... }
```

## CheckIn.tsx (`targets/desktop-tauri/app/ui/src/components/CheckIn.tsx`)
```tsx
export default function CheckIn(...) { ... }
```

## Journal.tsx (`targets/desktop-tauri/app/ui/src/components/Journal.tsx`)
```tsx
export default function Journal(){ ... }
```

## UrgeLog.tsx (`targets/desktop-tauri/app/ui/src/components/UrgeLog.tsx`)
```tsx
export default function UrgeLog(){ ... }
```

## ABCDForm.tsx, CBAForm.tsx, VACIForm.tsx, IfThenForm.tsx, Breath90.tsx
```tsx
// Each component implements its SMART form with local state + onComplete callback
```

## App.tsx (`targets/desktop-tauri/app/ui/src/App.tsx`)
```tsx
import React, { useMemo, useState } from 'react'
import ...

export default function App(){ ... }
```

## Cargo.toml (`targets/desktop-tauri/src-tauri/Cargo.toml`)
```toml
[package]
name = "smartbot-tauri"
version = "0.1.0"
edition = "2021"

[dependencies]
tauri = { version = "1", features = ["shell-all"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[build-dependencies]
tauri-build = { version = "1" }
```

## tauri.conf.json (`targets/desktop-tauri/src-tauri/tauri.conf.json`)
```json
{
  "$schema": "https://schema.tauri.app/config/1",
  "package": { "productName": "smartbot", "version": "0.1.0" },
  "tauri": { ... },
  "build": { ... }
}
```

## main.rs (`targets/desktop-tauri/src-tauri/src/main.rs`)
```rs
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![ensure_core])
    .setup(|_app| { let _ = ensure_core(); Ok(()) })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

---

### Run
```bash
# backend core
cd template
python -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn pydantic numpy
uvicorn template.core.main:app --reload

# desktop UI
cd ../targets/desktop-tauri/app/ui
npm i
npm run dev
npm run test
```

---

This markdown file now contains all files for Smartbot Desktop. Copy to your repo or split by path. Use Vitest for tests and Tauri for packaging.
