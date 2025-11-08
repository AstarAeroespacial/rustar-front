# Development Mode - Working Without Backend API

The frontend can now work independently without requiring the backend API to be running. This is useful for:

-   Frontend development and iteration
-   UI/UX testing
-   Working offline
-   Demo purposes

## How to Enable Mock Data

### Option 1: Environment Variable (Recommended)

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and set:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Restart your development server:

```bash
pnpm dev
```

### Option 2: Automatic Fallback

Even without enabling mock data explicitly, the application will automatically fall back to mock data if the API is unavailable. You'll see console warnings like:

```
API unavailable, using mock data
```

## Mock Data Includes

-   **3 Satellites** with realistic TLE data
-   **3 Ground Stations** in Spain (Madrid, Barcelona, Canary Islands)
-   **20 Telemetry data points** with temperature, voltage, and current readings
-   **5 Available commands** (Power On/Off, Reset, Deploy Antenna, Camera Capture)
-   **Command history** with different statuses
-   **Satellite passes** automatically generated based on timeframe

## Customizing Mock Data

Edit `/src/lib/mockData.ts` to modify:

-   Satellite configurations
-   Ground station locations
-   Telemetry values
-   Available commands
-   Pass predictions

## Switching Back to Real API

Set in `.env.local`:

```
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Or simply remove the variable and ensure your API is running at the configured endpoint.
