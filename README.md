# Event Hub Frontend

A modern, responsive Next.js frontend for the Event Hub application, powered by a Strapi headless CMS backend.

## 🚀 Features

- **Dynamic Event Listings:** Fetches and displays a list of upcoming events from the Strapi backend.
- **Rich Event Details:** Showcases event images, locations, dates, and organizer information.
- **Server-Side Rendering:** Pre-fetches data securely on the server for optimal SEO and performance.

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/API:** [Strapi](https://strapi.io/) (Headless CMS)
- **Language:** TypeScript

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- A running instance of the Strapi Event Hub backend ( https://github.com/ILyes-SS/event-hub-backend )

### Environment Setup

Create a `.env` (or `.env.local`) file in the root directory and configure the following variables:

```env
# URL to your Strapi backend instance
NEXT_PUBLIC_STRAPI_API_URL=http://127.0.0.1:1339
```

### Installation

1. Clone the repository and navigate to the frontend directory.
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

Start the application locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

  - `page.tsx` - The main homepage displaying the list of events.
- `public/` - Static assets.
- `next.config.ts` - Next.js configuration, including remote image patterns for Strapi.

