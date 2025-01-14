# Dreamscape - Event Management App

Dreamscape is a modern event management application built with Next.js, designed to streamline event creation, management, and participation.

## Features

- **Event Creation**: Easily create new events with detailed information
- **Event Details**: View comprehensive event information
- **RSVP System**: Allow users to RSVP to events
- **User Authentication**: Secure signup and login functionality
- **Dashboard**: Manage events and view analytics
- **Responsive Design**: Optimized for all devices

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

```
dreamscape/
├── public/          # Static assets
├── src/
│   ├── app/         # App routes and pages
│   ├── components/  # Reusable components
│   ├── models/      # Database models
│   ├── lib/         # Utility functions and configurations
│   ├── hooks/       # Custom React hooks
│   ├── types/       # TypeScript type definitions
│   └── styles/      # Global styles
├── .env.local       # Environment variables
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
