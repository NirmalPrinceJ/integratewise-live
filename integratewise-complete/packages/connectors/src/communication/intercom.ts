import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface IntercomConfig extends ConnectorConfig {
    accessToken: string;
}

export class IntercomConnector extends BaseConnector {
    constructor(protected override config: IntercomConfig) {
        super(config);
    }

    private get client() {
        return axios.create({
            baseURL: "https://api.intercom.io",
            headers: {
                "Authorization": `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
                "Intercom-Version": "2.10",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/me");
            return true;
        } catch {
            return false;
        }
    }

    async getContacts(): Promise<any[]> {
        const res = await this.client.get("/contacts");
        return res.data.data;
    }
}
