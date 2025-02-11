# Next-Fantasy-Football

Next-Fantasy-Football is a Next.js web application that manages a custom fantasy football draft. This project was migrated from an Express-based setup to Next.js, leveraging its file-based routing, built-in API routes, and modern data handling patterns.

## Table of Contents

- [Features](#features)
- [File Structure](#file-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Migration Summary](#migration-summary)
- [License](#license)

## Features

- **File Uploads:**

  - Upload Excel files via a dedicated API route.
  - Process uploads using `request.formData()` instead of multer.
  - Read Excel file data with the `xlsx` library (via Buffer-based reading).

- **Database Integration:**

  - Uses PostgreSQL with the `pg` library.
  - Automatically ensures necessary tables (`teams`, `players`) exist upon startup.

- **Next.js File-Based Routing:**
  - API routes are now part of the file system (e.g., `app/api/upload/route.js`).
  - HTTP methods (e.g., `POST`) are exported as named functions for handling requests.

## File Structure

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your environment variables:**  
   Create a `.env` file with the following structure and inserting your information:

   PG_USER=your_postgres_username
   PG_HOST=localhost
   PG_DATABASE=your_database_name
   PG_PASSWORD=your_password
   PG_PORT=5432

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**  
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Migration Summary

- **Routing:**

  - Moved from Express routes to Next.js file-based routing within the `app` directory.
  - API endpoints now export named HTTP method handlers (e.g., `export async function POST()`).

- **File Uploads:**

  - Replaced multer-based file processing with Next.js's native `request.formData()` method.
  - Implemented custom file saving logic that writes files to an `uploads` directory.

- **Controller Logic:**

  - Refactored file upload processing to return standard Response objects instead of using Express-style `res` methods.
  - Utilized Buffer-based reading with `xlsx` for improved file access.

- **Database Initialization:**

  - Ensured table creation is handled in `db.js`, eliminating the need for a separate `createTables.js` script.

- **Legacy Code Cleanup:**
  - Removed unnecessary dependencies and middleware (e.g., multer) to align with Next.js best practices.
