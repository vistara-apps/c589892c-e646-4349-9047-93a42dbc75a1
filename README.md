# PollPulse - Base Mini App

A community-driven polling platform built as a Base Mini App that rewards user participation with tokens.

## Features

- **Poll Generation**: Create custom polls with multiple-choice options and themes
- **Curated Poll Feed**: Discover trending and relevant polls based on community engagement
- **Incentivized Participation**: Earn tokens for voting, creating polls, and referring users
- **Insightful Results**: View real-time poll results and community trends
- **Farcaster Integration**: Seamless integration with Farcaster frames for social engagement

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet Integration**: MiniKit + OnchainKit
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pollpulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `NEXT_PUBLIC_MINIKIT_API_KEY`: Your MiniKit API key
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pollpulse/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── PollCard.tsx       # Individual poll display
│   ├── PollFeed.tsx       # Poll listing and filtering
│   ├── CreatePollForm.tsx # Poll creation form
│   ├── OptionButton.tsx   # Poll option voting button
│   ├── UserTokenBalance.tsx # Token balance display
│   └── LoadingSpinner.tsx # Loading indicator
├── lib/                   # Utility functions and types
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # App constants and mock data
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## Key Components

### PollCard
Displays individual polls with voting options, results, and metadata. Handles vote submission and result visualization.

### CreatePollForm
Form for creating new polls with validation, theme selection, and duration settings.

### PollFeed
Main feed displaying polls with filtering options (All, Trending, Recent).

### Token System
- **Vote Reward**: 10 tokens per vote
- **Create Poll**: 50 tokens per poll created
- **Referral Bonus**: 100 tokens per successful referral

## Base Mini App Integration

This app is built specifically for the Base ecosystem:

- **MiniKit Provider**: Handles wallet connections and Base network integration
- **OnchainKit Components**: Provides identity and wallet functionality
- **Base Network**: All transactions occur on Base for low fees and fast confirmation
- **Farcaster Frames**: Enables social sharing and in-frame interactions

## Development

### Adding New Features

1. **Create Types**: Add new interfaces to `lib/types.ts`
2. **Add Constants**: Update `lib/constants.ts` with new configuration
3. **Build Components**: Create reusable components in `components/`
4. **Update Pages**: Modify app router pages as needed

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system defined in `tailwind.config.js`
- Maintain consistent spacing and color usage
- Ensure mobile-first responsive design

### Token Economics

The app implements a simple token reward system:
- Users earn tokens for engagement (voting, creating polls)
- Tokens can be used for premium features (poll boosting, analytics)
- Future integration with Base DeFi protocols for token utility

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - Railway
   - Custom server

3. **Configure environment variables** in your deployment platform

4. **Set up Base Mini App manifest** for discovery in Base App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
