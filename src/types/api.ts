// API types based on the OpenAPI specification

export interface TelemetryResponse {
  timestamp: number;
  temperature: number;
  voltage: number;
  current: number;
  battery_level: number;
}

export interface TestMessage {
  number: number;
  message: string;
}

export interface ConfigResponse {
  server: ServerConfig;
  database: DatabaseConfig;
  message_broker: MessageBrokerConfig;
}

export interface ServerConfig {
  host: string;
  port: number;
}

export interface DatabaseConfig {
  url: string;
  pool_size: number;
}

export interface MessageBrokerConfig {
  host: string;
  port: number;
  keep_alive: number;
}

export interface HistoricTelemetryRequest {
  startTime?: number;
  endTime?: number;
}

export interface LatestTelemetryRequest {
  amount?: number;
}

// Additional types for the frontend
export interface Satellite {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastContact?: Date;
  position?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
}

export interface Command {
  id: string;
  satellite: string;
  command: string;
  status: 'pending' | 'sent' | 'success' | 'failed';
  timestamp: Date;
  response?: string;
}

export interface GroundStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  trackingSatellite?: {
    id: string;
    name: string;
    tle: {
      line1: string;
      line2: string;
    };
  };
  lastUpdate: Date;
}
