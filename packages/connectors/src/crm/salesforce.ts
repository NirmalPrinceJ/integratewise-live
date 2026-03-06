import axios from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface SalesforceConfig extends ConnectorConfig {
    instanceUrl: string;
    accessToken: string;
    apiVersion?: string;
}

export class SalesforceConnector extends BaseConnector {
    protected override config: SalesforceConfig;

    constructor(config: SalesforceConfig) {
        super(config);
        this.config = config;
    }

    private get client() {
        const version = this.config.apiVersion || "v60.0";
        return axios.create({
            baseURL: `${this.config.instanceUrl}/services/data/${version}`,
            headers: {
                "Authorization": `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/sobjects");
            return true;
        } catch (error) {
            return false;
        }
    }

    async query(soql: string): Promise<any[]> {
        try {
            const response = await this.client.get(`/query?q=${encodeURIComponent(soql)}`);
            return response.data.records;
        } catch (error) {
            throw new ConnectorError("SFDC SOQL Query failed", error);
        }
    }

    async getObject(objectName: string, id: string): Promise<any> {
        try {
            const response = await this.client.get(`/sobjects/${objectName}/${id}`);
            return response.data;
        } catch (error) {
            throw new ConnectorError(`Failed to fetch ${objectName} ${id}`, error);
        }
    }

    async createObject(objectName: string, data: any): Promise<string> {
        try {
            const response = await this.client.post(`/sobjects/${objectName}`, data);
            return response.data.id;
        } catch (error) {
            throw new ConnectorError(`Failed to create ${objectName}`, error);
        }
    }

    async updateObject(objectName: string, id: string, data: any): Promise<void> {
        try {
            await this.client.patch(`/sobjects/${objectName}/${id}`, data);
        } catch (error) {
            throw new ConnectorError(`Failed to update ${objectName} ${id}`, error);
        }
    }
}
