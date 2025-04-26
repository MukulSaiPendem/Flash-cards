# FlashCard Buddy

A modern, responsive flashcard application built with Next.js.

## Environment Variables

This application uses environment variables for configuration. Create a `.env` or `.env.local` file in the root directory with the following variables:

\`\`\`
DATABASE_URL="your-database-connection-string"
\`\`\`

### Database Connection String Examples:

- **PostgreSQL**: `postgresql://username:password@localhost:5432/flashcard_buddy`
- **MySQL**: `mysql://username:password@localhost:3306/flashcard_buddy`
- **MongoDB**: `mongodb+srv://username:password@cluster0.mongodb.net/flashcard_buddy?retryWrites=true&w=majority`

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env.local` file with your database connection string
4. Generate Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`
5. Run database migrations:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`
6. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

- Create, view, and review flashcards
- Organize flashcards by categories
- Responsive design for desktop, tablet, and mobile
- Smooth card flip animations
- Filter flashcards by category
\`\`\`

Let's also update the Next.js configuration to ensure it properly loads environment variables:

```typescriptreact file="next.config.mjs"
[v0-no-op-code-block-prefix]/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure environment variables are properly loaded
  env: {
    // You can add specific environment variables here if needed
  },
};

export default nextConfig;
