# F1 Sponsors CRM - A Mini Seller Console

A lightweight CRM dashboard built with React and Tailwind CSS to manage and convert sponsorship leads into active opportunities, themed for a Formula 1 team. This project was completed as a frontend development challenge.

**[Live Demo Link](https://mini-seller-console.netlify.app/)**

![F1 Sponsors CRM Screenshot](/gif.gif)

---

## About The Project

This application simulates a real-world sales funnel, starting from raw leads to qualified opportunities. It's a single-page application built from the ground up, focusing on a clean user interface, efficient state management, and a great developer experience. The entire application is fully responsive and persists data in the user's browser via `localStorage`.

## Features

-   **Lead Management:** View, filter, search, and sort a list of potential sponsors.
-   **Slide-Over Detail Panel:** Click on any lead to open a detailed view without leaving the main page.
-   **Inline Editing:** Edit a lead's status and email directly in the detail panel, with real-time email validation.
-   **Lead Conversion:** Convert qualified leads into active opportunities, moving them to a separate opportunities table.
-   **Data Persistence:** All leads and opportunities are saved in `localStorage`, so your data persists between sessions.
-   **Pagination:** Both tables include pagination to handle larger datasets gracefully.
-   **Responsive Design:** The layout is optimized for both desktop and mobile devices.
-   **Rich UX States:** Includes loading, empty, and error states for a smooth user experience.

## Tech Stack

-   **Framework:** React 18
-   **Build Tool:** Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Headless UI for the slide-over panel
-   **Deployment:** Netlify 

## Running Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository**
    ```sh
    git clone https://github.com/Fortuna09/mini-seller-console.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Run the development server**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another available port).

## Key Architectural Decisions

-   **State Management:** State is centralized in the main `App.tsx` component, acting as a single source of truth. Props are passed down to child components, and state is updated via callback functions (`lifting state up`).
-   **Performance:** The `useMemo` hook is used extensively to memoize expensive calculations like filtering, sorting, and searching. This ensures the UI remains fast and responsive, only re-calculating data when necessary dependencies change.
-   **Styling System:** A semantic color palette was defined in `tailwind.config.js` (`primary`, `accent`, etc.) to allow for easy and consistent theming across the entire application. Style maps were used within components for conditional styling (e.g., status badges) to keep the JSX clean and maintainable.