# BimoTech

BimoTech is an advanced localized manufacturing platform connecting businesses with top-tier suppliers for CNC machining, 3D printing, injection molding, and more. The platform features an AI-powered assistant ("Bimo") to guide users through the quoting and prototyping process.

## Features

- **AI-Powered Discovery**: Integrated "Bimo" AI agent (built with Google Genkit) helps users find the right manufacturing processes and materials.
- **Smart Quoting Engine**: Streamlined RFQ process with real-time status tracking.
- **Dynamic Catalog**: Comprehensive database of services, materials, and machines managed via a custom admin dashboard.
- **Admin Dashboard**: Powerful tools for administrators to manage products, services, suppliers, and quote requests.
- **Global Reach**: Built-in internationalization (i18n) support for multi-language access.
- **Modern UI/UX**: Premium aesthetic with dark mode, glassmorphism, and GSAP/Three.js animations.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: 
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [GSAP](https://gsap.com/) (Animations)
  - [Three.js](https://threejs.org/) (3D Visuals)
- **Backend & Database**: 
  - [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
  - [Google Genkit](https://firebase.google.com/docs/genkit) (Generative AI)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.x (for i18n scripts)
- Firebase Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/bimo-tech-website.git
   cd bimo-tech-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your Firebase and Google GenAI credentials.
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... other Firebase config
   GOOGLE_GENAI_API_KEY=... 
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts & Utilities

The project includes several utility scripts in the `scripts/` directory for database seeding and localization.

- **Seeding Data**:
  ```bash
  npx tsx scripts/seed-services.ts  # Populate initial services data
  npx tsx scripts/seed-admin.ts     # Create/reset admin users
  ```

- **Internationalization (i18n)**:
  ```bash
  python3 scripts/extract_i18n.py   # Extract hardcoded strings for translation
  python3 scripts/translate_i18n.py # Translate extracted strings using AI
  ```

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, Firebase configuration, and shared logic.
- `scripts`: Database seeding and i18n automation scripts.
- `public`: Static assets (images, fonts).

## Testing

Run unit and integration tests with:

```bash
npm run test
```
