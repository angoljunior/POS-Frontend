# Nexus POS frontend

React 19 + Vite, with Tailwind CSS v4 and shadcn/ui (Radix, JavaScript).

## Development

Run commands from this directory:

```sh
npm install
npm run dev
npm run build
npm run lint
```

On Windows PowerShell with script execution disabled, use `npm.cmd` and `npx.cmd`.

## Styling and components

Tailwind runs through `@tailwindcss/vite`. Global styles and theme tokens live in
`src/index.css`; Vite and `jsconfig.json` map `@/` to `src/`.

The UI components required by the existing dashboard and POS screens are:
Button, Input, Label, Textarea, Avatar, Dialog, and Sheet. Their editable source
lives in `src/components/ui`, with the `cn` utility in `src/lib/utils.js`.

```jsx
import { Button } from "@/components/ui/button"

<Button variant="outline" className="mt-4">Save</Button>
```

Add more components as features need them:

```sh
npx shadcn@latest add select
```

Configuration is in `components.json`. Setup follows the official guide:
https://ui.shadcn.com/docs/installation/vite

## Review notes

- Dashboard and POS currently use local demonstration data; cash checkout is a
  frontend preview and does not record a payment.
- Several navigation destinations remain placeholder pages.
- `src/api/index.js` exports a missing `purchases.api.js` module. The current
  screens do not import this barrel, but it must be resolved before using it.
- The initial setup had missing UI components/dependencies, no Tailwind or `@/`
  alias configuration, a misspelled Dashboard filename, and incorrect POS
  component paths. These are addressed by the UI setup.
