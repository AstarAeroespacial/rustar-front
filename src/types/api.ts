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

export interface Satellite {
  id: number;
  name: string;
  tle: string;
  downlink_frequency: number;
  uplink_frequency: number;
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
  altitude: number;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  trackingSatellite?: {
    id: number;
    name: string;
    tle: string;
  };
  lastUpdate: Date;
}

export interface AvailableCommand {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'telemetry' | 'control' | 'maintenance';
  requiresConfirmation: boolean;
}
