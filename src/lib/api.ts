// For now, we'll use environment variables directly since env.js has module issues
// import { env } from "~/env.js";
import type { 
  TelemetryResponse, 
  TestMessage, 
  ConfigResponse,
  HistoricTelemetryRequest,
  LatestTelemetryRequest 
} from "~/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Command endpoints
  async sendCommand(message: TestMessage): Promise<TelemetryResponse[]> {
    return this.request<TelemetryResponse[]>('/api/control/command', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Telemetry endpoints
  async getHistoricTelemetry(
    satellite: string,
    params?: HistoricTelemetryRequest
  ): Promise<TelemetryResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.startTime) searchParams.set('startTime', params.startTime.toString());
    if (params?.endTime) searchParams.set('endTime', params.endTime.toString());
    
    const query = searchParams.toString();
    const endpoint = `/api/telemetry/${satellite}/history${query ? `?${query}` : ''}`;
    
    return this.request<TelemetryResponse[]>(endpoint);
  }

  async getLatestTelemetry(
    satellite: string,
    params?: LatestTelemetryRequest
  ): Promise<TelemetryResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.amount) searchParams.set('amount', params.amount.toString());
    
    const query = searchParams.toString();
    const endpoint = `/api/telemetry/${satellite}/latest${query ? `?${query}` : ''}`;
    
    return this.request<TelemetryResponse[]>(endpoint);
  }

  // Config endpoint
  async getConfig(): Promise<ConfigResponse> {
    return this.request<ConfigResponse>('/config');
  }
}

export const apiClient = new ApiClient();
