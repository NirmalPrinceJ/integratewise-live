import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface HubSpotConfig extends ConnectorConfig {
    accessToken: string;
}

export class HubSpotConnector extends BaseConnector {
    protected override config: HubSpotConfig;

    constructor(config: HubSpotConfig) {
        super(config);
        this.config = config;
    }

    private get client() {
        return axios.create({
            baseURL: "https://api.hubapi.com",
            headers: {
                "Authorization": `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/crm/v3/objects/contacts?limit=1");
            return true;
        } catch {
            return false;
        }
    }

    async getContacts(limit = 100, after?: string): Promise<any> {
        try {
            const params: any = { limit };
            if (after) params.after = after;
            const response = await this.client.get("/crm/v3/objects/contacts", { params });
            return response.data;
        } catch (error) {
            throw new ConnectorError("Failed to fetch HubSpot contacts", error);
        }
    }

    async getCompanies(limit = 100, after?: string): Promise<any> {
        try {
            const params: any = { limit };
            if (after) params.after = after;
            const response = await this.client.get("/crm/v3/objects/companies", { params });
            return response.data;
        } catch (error) {
            throw new ConnectorError("Failed to fetch HubSpot companies", error);
        }
    }

    async getDeals(limit = 100, after?: string): Promise<any> {
        try {
            const params: any = { limit };
            if (after) params.after = after;
            const response = await this.client.get("/crm/v3/objects/deals", { params });
            return response.data;
        } catch (error) {
            throw new ConnectorError("Failed to fetch HubSpot deals", error);
        }
    }
}
