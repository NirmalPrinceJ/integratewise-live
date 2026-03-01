import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface SlackConfig extends ConnectorConfig {
    botToken: string;
}

export class SlackConnector extends BaseConnector {
    constructor(protected override config: SlackConfig) {
        super(config);
    }

    private get client() {
        return axios.create({
            baseURL: "https://slack.com/api",
            headers: {
                "Authorization": `Bearer ${this.config.botToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            const res = await this.client.post("/auth.test");
            return res.data.ok;
        } catch {
            return false;
        }
    }

    async getChannels(): Promise<any[]> {
        const res = await this.client.get("/conversations.list");
        if (!res.data.ok) throw new ConnectorError("Slack API Error", res.data.error);
        return res.data.channels;
    }
}
