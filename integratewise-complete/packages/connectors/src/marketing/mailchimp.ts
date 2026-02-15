import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface MailchimpConfig extends ConnectorConfig {
    dataCenter: string;
    apiKey: string;
}

export class MailchimpConnector extends BaseConnector {
    constructor(protected override config: MailchimpConfig) {
        super(config);
    }

    private get client() {
        return axios.create({
            baseURL: `https://${this.config.dataCenter}.api.mailchimp.com/3.0`,
            headers: {
                "Authorization": `apikey ${this.config.apiKey}`,
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/ping");
            return true;
        } catch {
            return false;
        }
    }

    async getLists(): Promise<any[]> {
        const res = await this.client.get("/lists");
        return res.data.lists;
    }
}
