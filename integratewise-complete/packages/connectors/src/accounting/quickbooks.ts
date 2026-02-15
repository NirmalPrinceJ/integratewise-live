import axios, { AxiosInstance } from "axios";
import { BaseConnector, ConnectorConfig, ConnectorError } from "@integratewise/connector-contracts";

export interface QuickBooksConfig extends ConnectorConfig {
    realmId: string;
    accessToken: string;
    refreshToken?: string;
    environment: "sandbox" | "production";
}

export class QuickBooksConnector extends BaseConnector {
    private client: AxiosInstance;
    protected override config: QuickBooksConfig;

    constructor(config: QuickBooksConfig) {
        super(config);
        this.config = config;
        const baseUrl = config.environment === "production"
            ? "https://quickbooks.api.intuit.com/v3/company"
            : "https://sandbox-quickbooks.api.intuit.com/v3/company";

        this.client = axios.create({
            baseURL: `${baseUrl}/${config.realmId}`,
            headers: {
                "Authorization": `Bearer ${config.accessToken}`,
                "Accept": "application/json",
            },
        });
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.client.get("/companyinfo/" + this.config.realmId);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getInvoices(params?: any): Promise<any[]> {
        const query = "select * from Invoice";
        try {
            const response = await this.client.get(`/query?query=${encodeURIComponent(query)}`);
            return response.data.QueryResponse.Invoice || [];
        } catch (error) {
            throw new ConnectorError("Failed to fetch QuickBooks invoices", error);
        }
    }

    async getCustomers(): Promise<any[]> {
        const query = "select * from Customer";
        try {
            const response = await this.client.get(`/query?query=${encodeURIComponent(query)}`);
            return response.data.QueryResponse.Customer || [];
        } catch (error) {
            throw new ConnectorError("Failed to fetch QuickBooks customers", error);
        }
    }

    async getProfitAndLoss(params?: { start_date: string; end_date: string }): Promise<any> {
        try {
            const response = await this.client.get("/reports/ProfitAndLoss", { params });
            return response.data;
        } catch (error) {
            throw new ConnectorError("Failed to fetch P&L report", error);
        }
    }

    async getBalanceSheet(params?: { as_of_date: string }): Promise<any> {
        try {
            const response = await this.client.get("/reports/BalanceSheet", { params: { date_macro: "This Fiscal Year-to-date", ...params } });
            return response.data;
        } catch (error) {
            throw new ConnectorError("Failed to fetch Balance Sheet", error);
        }
    }
}
