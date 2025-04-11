# Countdown Timer

A futuristic countdown timer web application that allows users to set and track a 24-hour countdown with delightful celebrations upon completion.

## Features

- Single countdown timer with persistence
- Futuristic UI design with animations
- Full-screen celebration effects
- Sound notifications
- Social sharing capabilities
- Responsive design

## Tech Stack

- Framework: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- Animations: Framer Motion
- Effects: Canvas Confetti
- Audio: use-sound
- Date Handling: date-fns
- Social: react-share

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main page component
│   └── globals.css       # Global styles
├── components/
│   ├── CountdownTimer/
│   │   ├── index.tsx           # Main timer component
│   │   ├── DisplayTimer.tsx    # Timer display
│   │   └── TimeSetterForm.tsx  # Time input form
│   ├── Celebrations/
│   │   ├── Confetti.tsx       # Confetti effect
│   │   └── CelebrationModal.tsx # Completion modal
│   └── ui/
│       ├── Button.tsx         # Reusable button
│       └── Input.tsx          # Reusable input
├── hooks/
│   ├── useCountdown.ts    # Timer logic
│   ├── useSound.ts        # Sound effects
│   └── useLocalStorage.ts # Persistence
├── store/
│   └── timerStore.ts      # Global state
└── utils/
    ├── time.ts           # Time calculations
    └── constants.ts      # App constants
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
