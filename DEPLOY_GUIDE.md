# GitHub & Deployment Guide

Since I cannot directly access your GitHub account, here are the steps to push your code and deploy it.

## 1. Create a Repository on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Name your repository (e.g., `pda-generator`).
3.  **Do not** check "Initialize with README", .gitignore, or license (we already have them).
4.  Click **Create repository**.

## 2. Push Your Code
I have already initialized the local git repository and committed the files. You just need to link it to GitHub.

Run these commands in your terminal (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/pda-generator.git
git branch -M main
git push -u origin main
```

## 3. Deployment Options

### Option A: GitHub Pages (Free & Easy)
Since this is a Vite project, you need a small configuration change to deploy to GitHub Pages.

1.  **Update `vite.config.ts`**:
    Add `base: '/pda-generator/',` (replace with your repo name) to the config object.
    ```typescript
    export default defineConfig({
      plugins: [react()],
      base: '/pda-generator/', 
    })
    ```
2.  **Push the change**:
    ```bash
    git add .
    git commit -m "Configure for GitHub Pages"
    git push
    ```
3.  **Go to GitHub Settings**:
    - Repository -> Settings -> Pages.
    - Source: `GitHub Actions` (or use a deploy script).
    - *Easier method*: Use a deploy script.
      1. Install `gh-pages`: `npm install gh-pages --save-dev`
      2. Add to `package.json`: `"deploy": "gh-pages -d dist"`
      3. Run `npm run build` then `npm run deploy`.

### Option B: Vercel (Recommended for React)
Vercel is often easier for React/Vite apps.

1.  Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2.  Click **Add New Project**.
3.  Select your `pda-generator` repository.
4.  Click **Deploy**.
5.  Done! It will automatically redeploy whenever you push to GitHub.

### Option C: Netlify
Similar to Vercel.
1.  Go to [netlify.com](https://netlify.com).
2.  Drag and drop your `dist` folder (run `npm run build` first) to manually deploy, OR connect your GitHub repo for auto-deployments.
