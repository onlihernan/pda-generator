# PDA Generator

A web application to generate **Proforma Disbursement Accounts (PDA)** for ships in Argentine ports.

## Features

- **Port Selection**: Choose from various Argentine cities and ports (e.g., San Lorenzo, Rosario).
- **Vessel Particulars**: Input ship dimensions (LOA, Beam, Depth), tonnage (NRT, GRT), and drafts.
- **Dynamic Calculation**: Real-time cost estimation based on configurable tariffs.
- **Exchange Rate**: Automatic fetching of official USD selling rate (Banco Nación via API).
- **Admin Interface**: 
  - Manage tariffs (Add/Edit/Delete).
  - Persistence via LocalStorage.
  - Default password: `admin123`.

## Tech Stack

- React
- TypeScript
- Vite
- Vanilla CSS (Rich Aesthetics)

## Getting Started

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Deployment

This project is ready to be deployed to GitHub Pages, Vercel, or Netlify.
