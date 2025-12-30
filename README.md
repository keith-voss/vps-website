# Voss Property Solutions

A modern, responsive website for **Voss Property Solutions**, a leading pavement marking and warehouse safety company in the Mid-Atlantic region.

## 🚀 Project Overview

This website serves as the digital storefront for Voss Property Solutions, showcasing their services in industrial pavement marking, warehouse safety solutions, and regulatory compliance (ADA).

**Key Features:**
*   **Service Showcases**: Detailed pages for exterior and interior services.
*   **Blog & Case Studies**: A content-rich blog with "Before vs. After" transformations.
*   **Interactive Locations**: Visual maps covering Baltimore and surrounding counties.
*   **Request Estimate**: Integrated modal and calls-to-action for lead generation.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Technology Stack

This project is built with a modern frontend stack focusing on performance and developer experience:

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Tailwind)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Meta Tags**: [React Helmet Async](https://github.com/staylor/react-helmet-async)

## 💻 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
-   [Node.js](https://nodejs.org/) (Version 18+ recommended)
-   A package manager like `npm` (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/vosspropertysolutions.git
    cd vosspropertysolutions
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with HMR. |
| `npm run build` | Builds the app for production to the `dist` folder. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run preview` | Locally questions the production build. |

## 📂 Project Structure

```
src/
├── assets/         # Images, logos, and static files
├── components/     # Reusable UI components (Header, Footer, Shadcn UI)
├── data/           # Static data files (Blog posts, locations)
├── pages/          # Main application views (Home, Services, Blog)
├── lib/            # Utility functions (Tailwind merge, etc.)
└── App.tsx         # Main application root and routing
```

## 🚀 Deployment

The site is configured for easy deployment on **Vercel** or **Netlify**.

### Deploying to Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will detect Vite and deploy automatically.
4.  Updates are live immediately after pushing to `main`.

For manual updates via CLI:
```bash
npm i -g vercel
vercel --prod
```
