# ChronoShifter - League of Legends Profile Tracker

A Next.js application for tracking and displaying League of Legends player profiles, match history, and statistics using the Riot Games API.

## Features

- **Player Profile Lookup**: Search for players by Riot ID (gameName#tagLine)
- **Match History**: View recent match details with comprehensive statistics
- **Rank Information**: Display Solo/Duo and Flex queue rankings
- **Match Analytics**: Detailed participant information including:
  - Champion performance
  - Items and builds
  - Runes and summoner spells
  - KDA and farming statistics
  - Arena mode support

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with Framer Motion animations
- **API**: Riot Games API integration
- **Data Sources**: League of Legends Data Dragon assets

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── [tagLine]/[gameName]/     # Dynamic player profile routes
│   └── layout.tsx                # Root layout
├── components/
│   ├── common/                   # Shared UI components
│   ├── leagueProfile/           # Player profile specific components
│   └── mainPage/                # Landing page components
├── interfaces/
│   ├── productionTypes.ts       # Application data types
│   └── rawTypes.ts              # Riot API response types
└── utils/
    ├── fetchLeagueAPI/          # Riot API integration
    ├── getLeagueAssets/         # Asset management utilities
    └── helpers.ts               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- Riot Games API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chrono_shifter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
RIOT_API_KEY=your_riot_api_key_here
NEXT_PUBLIC_GAME_VERSION=15.10.1
```

4. Download League of Legends assets:
```bash
# Run the Python script to download latest game data
cd src/utils/getLeagueAssets
python download-jsons.py
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Integration

The application integrates with multiple Riot Games API endpoints:

- **Account API**: Player account information
- **Summoner API**: League-specific player data
- **League API**: Ranked information
- **Match API**: Match history and details
- **Data Dragon**: Static game assets

### Supported Regions

- Europe West (EUW1)
- North America (NA1)
- Korea (KR)
- Europe Nordic & East (EUN1)
- And more...

## Asset Management

The application uses a Python script to automatically download and update League of Legends assets:

- Champion data
- Item information
- Rune details
- Summoner spells
- Game version management

Run `python src/utils/getLeagueAssets/download-jsons.py` to update assets.

## Key Components

### Player Profile (`/[tagLine]/[gameName]/[activeRegion]`)
- Displays player information and statistics
- Shows current rank in Solo/Duo and Flex queues
- Lists recent match history with detailed analytics

### Match Cards
- Individual match summaries with champion, KDA, and items
- Color-coded win/loss indicators
- Participant lists with performance metrics

### Asset Integration
- Dynamic champion portraits and item icons
- Rune and summoner spell displays
- Responsive image loading with Next.js Image optimization

## Development

### Adding New Features

1. Define TypeScript interfaces in `src/interfaces/`
2. Create API functions in `src/utils/fetchLeagueAPI/`
3. Build components in `src/components/`
4. Add routes in `src/app/`

### Asset Updates

The application automatically updates the game version in `.env` when running the asset download script. This ensures compatibility with the latest League of Legends patch.

## Performance Considerations

- Server-side rendering for SEO optimization
- Efficient API caching strategies
- Optimized image loading with Next.js Image
- Responsive design for mobile and desktop

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RIOT_API_KEY` | Your Riot Games API key | Yes |
| `NEXT_PUBLIC_GAME_VERSION` | Current League patch version | Yes (auto-updated) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Riot Games API usage must comply with their Terms of Service.

## Disclaimer

ChronoShifter isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.