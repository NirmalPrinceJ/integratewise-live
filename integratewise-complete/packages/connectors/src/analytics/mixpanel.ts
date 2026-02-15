import axios, { AxiosInstance } from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError, ConnectorMetadata } from "@integratewise/connector-contracts";

// ============================================================================
// Mixpanel Connector — Mixpanel Ingestion + Data Export API
// ============================================================================

export interface MixpanelConfig extends ConnectorConfig {
  projectToken: string;       // For tracking/ingestion
  serviceAccountUser?: string; // For data export
  serviceAccountSecret?: string;
  projectId?: string;
  dataResidency?: "US" | "EU";
}

export interface MixpanelEvent {
  event: string;
  properties: {
    distinct_id: string;
    time?: number;
    $insert_id?: string;
    token?: string;
    [key: string]: any;
  };
}

export interface MixpanelProfile {
  $distinct_id: string;
  $properties: Record<string, any>;
}

export interface MixpanelQueryResult {
  computed_at: string;
  series: string[];
  data: {
    values: Record<string, Record<string, number>>;
  };
}

export interface MixpanelFunnel {
  meta: { dates: string[] };
  data: Record<string, { steps: Array<{ count: number; step_conv_ratio: number; overall_conv_ratio: number; avg_time?: number; event: string }> }>;
}

export interface MixpanelRetention {
  data: Record<string, {
    counts: number[];
    first: number;
  }>;
}

export interface MixpanelCohort {
  id: number;
  name: string;
  description?: string;
  created: string;
  count: number;
  is_visible: boolean;
}

export class MixpanelConnector extends BaseConnector {
  private ingestionClient: AxiosInstance;
  private dataClient: AxiosInstance;
  protected override config: MixpanelConfig;

  constructor(config: MixpanelConfig) {
    super(config);
    this.config = config;

    const isEU = config.dataResidency === "EU";
    const ingestionBase = isEU ? "https://api-eu.mixpanel.com" : "https://api.mixpanel.com";
    const dataBase = isEU ? "https://eu.mixpanel.com/api/2.0" : "https://mixpanel.com/api/2.0";

    this.ingestionClient = axios.create({
      baseURL: ingestionBase,
      timeout: 10000,
      headers: { "Content-Type": "application/json", "Accept": "text/plain" },
    });

    this.dataClient = axios.create({
      baseURL: dataBase,
      timeout: 60000,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      auth: config.serviceAccountUser && config.serviceAccountSecret
        ? { username: config.serviceAccountUser, password: config.serviceAccountSecret }
        : undefined,
    });

    this.dataClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) throw new ConnectorError("Invalid Mixpanel credentials", error);
        if (error.response?.status === 429) throw new ConnectorError("Mixpanel API rate limit exceeded", error);
        throw new ConnectorError(`Mixpanel API error: ${error.response?.data?.error || error.message}`, error);
      }
    );
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: "mixpanel",
      name: "Mixpanel",
      version: "1.0.0",
      apiVersion: "v2",
      capabilities: { sync: true, webhooks: false, dataVelocity: "high" },
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      // Track a minimal event to verify token
      const response = await this.ingestionClient.post("/track", [{
        event: "$iw_health_check",
        properties: { distinct_id: "__iw__", token: this.config.projectToken },
      }]);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Tracking / Ingestion API
  // ---------------------------------------------------------------------------
  async track(events: MixpanelEvent | MixpanelEvent[]): Promise<{ status: number; error?: string }> {
    try {
      const batch = Array.isArray(events) ? events : [events];
      const payload = batch.map((e) => ({
        event: e.event,
        properties: {
          ...e.properties,
          token: this.config.projectToken,
          time: e.properties.time || Math.floor(Date.now() / 1000),
        },
      }));
      const response = await this.ingestionClient.post("/track", payload);
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to track Mixpanel event(s)", error);
    }
  }

  async trackBatch(events: MixpanelEvent[]): Promise<{ status: number }> {
    try {
      // Mixpanel accepts up to 2000 events per batch
      const chunks: MixpanelEvent[][] = [];
      for (let i = 0; i < events.length; i += 2000) {
        chunks.push(events.slice(i, i + 2000));
      }
      for (const chunk of chunks) {
        await this.track(chunk);
      }
      return { status: 1 };
    } catch (error) {
      throw new ConnectorError("Failed to batch track Mixpanel events", error);
    }
  }

  // ---------------------------------------------------------------------------
  // User Profiles
  // ---------------------------------------------------------------------------
  async setProfile(distinctId: string, properties: Record<string, any>): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/engage", [{
        $token: this.config.projectToken,
        $distinct_id: distinctId,
        $set: properties,
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to set Mixpanel profile for ${distinctId}`, error);
    }
  }

  async setProfileOnce(distinctId: string, properties: Record<string, any>): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/engage", [{
        $token: this.config.projectToken,
        $distinct_id: distinctId,
        $set_once: properties,
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to set_once Mixpanel profile for ${distinctId}`, error);
    }
  }

  async incrementProfile(distinctId: string, properties: Record<string, number>): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/engage", [{
        $token: this.config.projectToken,
        $distinct_id: distinctId,
        $add: properties,
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to increment Mixpanel profile for ${distinctId}`, error);
    }
  }

  async appendToProfile(distinctId: string, properties: Record<string, any>): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/engage", [{
        $token: this.config.projectToken,
        $distinct_id: distinctId,
        $append: properties,
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to append to Mixpanel profile for ${distinctId}`, error);
    }
  }

  async deleteProfile(distinctId: string): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/engage", [{
        $token: this.config.projectToken,
        $distinct_id: distinctId,
        $delete: "",
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to delete Mixpanel profile for ${distinctId}`, error);
    }
  }

  // ---------------------------------------------------------------------------
  // Data Export / Query API
  // ---------------------------------------------------------------------------
  async queryEvents(params: {
    from_date: string; // YYYY-MM-DD
    to_date: string;
    event?: string[];
    where?: string;
    limit?: number;
  }): Promise<MixpanelQueryResult> {
    try {
      const response = await this.dataClient.get("/events", {
        params: {
          from_date: params.from_date,
          to_date: params.to_date,
          event: params.event ? JSON.stringify(params.event) : undefined,
          where: params.where,
          limit: params.limit || 255,
          type: "general",
          unit: "day",
        },
      });
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to query Mixpanel events", error);
    }
  }

  async getTopEvents(params: { from_date: string; to_date: string; limit?: number }): Promise<{ events: Array<{ event: string; count: number }> }> {
    try {
      const response = await this.dataClient.get("/events/top", {
        params: { ...params, type: "general", limit: params.limit || 10 },
      });
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to fetch Mixpanel top events", error);
    }
  }

  async getFunnelReport(funnelId: number, params: { from_date: string; to_date: string; unit?: string }): Promise<MixpanelFunnel> {
    try {
      const response = await this.dataClient.get(`/funnels`, {
        params: { funnel_id: funnelId, ...params, unit: params.unit || "day" },
      });
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to fetch Mixpanel funnel ${funnelId}`, error);
    }
  }

  async getRetention(params: {
    from_date: string;
    to_date: string;
    born_event: string;
    event?: string;
    retention_type?: "birth" | "compounding";
    unit?: "day" | "week" | "month";
  }): Promise<MixpanelRetention> {
    try {
      const response = await this.dataClient.get("/retention", {
        params: { ...params, unit: params.unit || "day", retention_type: params.retention_type || "birth" },
      });
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to fetch Mixpanel retention report", error);
    }
  }

  async queryProfiles(params?: {
    where?: string;
    output_properties?: string[];
    page?: number;
    page_size?: number;
  }): Promise<{ results: MixpanelProfile[]; page: number; total: number }> {
    try {
      const response = await this.dataClient.post("/engage", {
        where: params?.where || "",
        output_properties: params?.output_properties,
        page: params?.page || 0,
        page_size: params?.page_size || 100,
      });
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to query Mixpanel profiles", error);
    }
  }

  // ---------------------------------------------------------------------------
  // Cohorts
  // ---------------------------------------------------------------------------
  async listCohorts(): Promise<MixpanelCohort[]> {
    try {
      const response = await this.dataClient.get("/cohorts/list");
      return response.data;
    } catch (error) {
      throw new ConnectorError("Failed to list Mixpanel cohorts", error);
    }
  }

  // ---------------------------------------------------------------------------
  // Group Analytics
  // ---------------------------------------------------------------------------
  async setGroup(groupKey: string, groupId: string, properties: Record<string, any>): Promise<{ status: number }> {
    try {
      const response = await this.ingestionClient.post("/groups", [{
        $token: this.config.projectToken,
        $group_key: groupKey,
        $group_id: groupId,
        $set: properties,
      }]);
      return response.data;
    } catch (error) {
      throw new ConnectorError(`Failed to set Mixpanel group ${groupKey}:${groupId}`, error);
    }
  }
}

export function createMixpanelConnector(config: MixpanelConfig): MixpanelConnector {
  return new MixpanelConnector(config);
}
