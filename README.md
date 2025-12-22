# RUSTAR frontend

A modern web application for satellite management and control, built with the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC).

## Features

- **Dashboard**: Overview of all satellites with real-time status monitoring
- **Command Center**: Send commands to satellites with predefined and custom options
- **Telemetry Monitoring**: Real-time telemetry data visualization with charts
- **Satellite Tracking**: Interactive map showing satellite positions and orbital paths
- **Settings**: Configure API endpoints and application preferences

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **API**: tRPC for type-safe API calls
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Leaflet with react-leaflet
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Running Rust API backend (see API documentation)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your API base URL in `.env.local`:
   ```
   API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The application integrates with a Rust-based satellite management API. The API provides:

- `/api/control/command` - Send commands to satellites
- `/api/telemetry/{satellite}/history` - Get historical telemetry data
- `/api/telemetry/{satellite}/latest` - Get latest telemetry data
- `/config` - Get system configuration

## Desktop App Support

The application is designed to be compatible with desktop app frameworks:

- **Tauri**: Recommended for Rust integration
- **Electron**: Alternative option for broader compatibility

## Project Structure

```
src/
├── components/          # Reusable UI components
├── lib/                # Utility libraries and API client
├── pages/              # Next.js pages and API routes
├── server/             # tRPC server configuration
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and tRPC client
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Environment Variables

Create a `.env.local` file with:

```env
API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
