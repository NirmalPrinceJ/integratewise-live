import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { JiraConnector } from "../../project-management/jira";
import { LinearConnector } from "../../project-management/linear";
import { GitHubConnector } from "../../project-management/github";
import { AsanaConnector } from "../../project-management/asana";

/**
 * Engineering Domain Master — manages Jira, Linear, GitHub, Asana.
 *
 * Covers project management, issue tracking, source control.
 */
export class EngineeringMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "engineering";
    readonly domainName = "Engineering & DevOps";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "jira",
            name: "Jira",
            category: "project_management",
            connectorClass: JiraConnector,
            authType: "basic",
            requiredFields: ["baseUrl", "email", "apiToken"],
            description: "Jira — issues, sprints, boards, projects, worklogs",
        },
        {
            id: "linear",
            name: "Linear",
            category: "project_management",
            connectorClass: LinearConnector,
            authType: "api_key",
            requiredFields: ["apiKey"],
            description: "Linear — issues, teams, projects, cycles, labels",
        },
        {
            id: "github",
            name: "GitHub",
            category: "source_control",
            connectorClass: GitHubConnector,
            authType: "token",
            requiredFields: ["accessToken"],
            description: "GitHub — repos, issues, PRs, commits, actions",
        },
        {
            id: "asana",
            name: "Asana",
            category: "project_management",
            connectorClass: AsanaConnector,
            authType: "token",
            requiredFields: ["accessToken"],
            description: "Asana — workspaces, projects, tasks, subtasks",
        },
    ];

    // ----- Unified engineering operations -----

    async getActiveIssues(limit = 50): Promise<any[]> {
        const primary = this.primaryProviderId;
        if (primary === "jira") {
            const jira = this.getProvider<JiraConnector>("jira");
            return jira.getIssues({ maxResults: limit });
        }
        if (primary === "linear") {
            const linear = this.getProvider<LinearConnector>("linear");
            const result = await linear.getIssues({ first: limit });
            return result.issues || [];
        }
        if (primary === "github") {
            // GitHub needs owner/repo — return repos instead
            const gh = this.getProvider<GitHubConnector>("github");
            return gh.listRepos({ per_page: limit });
        }
        if (primary === "asana") {
            const asana = this.getProvider<AsanaConnector>("asana");
            return asana.listWorkspaces();
        }
        throw new Error("No engineering provider configured");
    }
}
