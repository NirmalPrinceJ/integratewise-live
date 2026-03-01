import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface ZendeskConfig extends ConnectorConfig {
    subdomain: string;
    email: string;
    apiToken: string;
}

export class ZendeskConnector extends BaseConnector {
    protected override config: ZendeskConfig;

    constructor(config: ZendeskConfig) {
        super(config);
        this.config = config;
    }

    private get client() {
        const auth = Buffer.from(`${this.config.email}/token:${this.config.apiToken}`).toString('base64');
        return axios.create({
            baseURL: `https://${this.config.subdomain}.zendesk.com/api/v2`,
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/users/me");
            return true;
        } catch {
            return false;
        }
    }

    async getTickets(params?: any): Promise<any[]> {
        try {
            const response = await this.client.get("/tickets", { params });
            return response.data.tickets;
        } catch (error) {
            throw new ConnectorError("Failed to fetch Zendesk tickets", error);
        }
    }
}
