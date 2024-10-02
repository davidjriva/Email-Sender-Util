# My Electron App

A simple Electron application to demonstrate the basic structure and functionality of an Electron app.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Production](#production)

## Prerequisites

- [Node.js](https://nodejs.org/) (v12.x or later)
- npm (comes with Node.js)

## Installation

Clone the repository to your local machine

```bash
git clone https://github.com/yourusername/my-electron-app.git
cd my-electron-app
```

Download all dependencies

`npm i`

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Production

First, create the build artifact:
`npm run build`

Next, replace `/_next` with `./_next` in `out/index.html`

Finally, create the distribution:
`npm run dist`

This results in a `dist/<app-name>.dmg` file getting generated that can be double-clicked and opened.
