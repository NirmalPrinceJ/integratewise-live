
const fs = require('fs');
const path = require('path');

const DEPARTMENTS = [
    'admin', 'ops', 'sales', 'marketing', 'cs', 'engineering', 'finance', 'people', 'projects', 'personal', 'accounts'
];

const CORE_PAGES = [
    'home', 'today', 'tasks', 'goals', 'spine', 'context', 'brainstorming', 'iq-hub', 'agent', 'profile'
];

const INTELLIGENCE_PAGES = ['spine', 'context', 'brainstorming', 'iq-hub'];
const THINK_PAGES = ['signals', 'predictions', 'agent'];
const ACT_PAGES = ['workflows', 'automations', 'approvals'];
const GOVERN_PAGES = ['audit', 'evidence', 'policies'];

const DEPT_SPECIFICS = {
    ops: ['processes', 'resources', 'capacity'],
    sales: ['pipeline', 'deals', 'accounts', 'contacts', 'forecasting'],
    marketing: ['campaigns', 'leads', 'content', 'website', 'analytics'],
    cs: ['tickets', 'customers', 'health', 'renewals'],
    engineering: ['sprints', 'releases', 'incidents', 'tech-debt'],
    finance: ['budgets', 'expenses', 'revenue', 'invoices'],
    people: ['employees', 'recruiting', 'performance', 'payroll'],
    projects: ['all-projects', 'milestones', 'resources', 'timeline']
};

const BASE_PATH = path.join(process.cwd(), 'src/app/(app)');

function createPage(dept, page) {
    const dir = path.join(BASE_PATH, dept, page);
    const filePath = path.join(dir, 'page.tsx');

    if (fs.existsSync(filePath)) {
        // console.log(`Skipping existing: ${dept}/${page}`);
        return;
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const content = `"use client"

import { ViewStub } from "@/components/views/stubs/view-stub"

export default function Page() {
  const viewName = "${dept.charAt(0).toUpperCase() + dept.slice(1)}";
  const pageName = "${page.charAt(0).toUpperCase() + page.slice(1)}";
  
  return <ViewStub view={viewName} page={pageName} />
}
`;

    fs.writeFileSync(filePath, content);
    console.log(`Created: ${dept}/${page}`);
}

DEPARTMENTS.forEach(dept => {
    // Core pages
    CORE_PAGES.forEach(page => createPage(dept, page));

    // Cross-department sections
    THINK_PAGES.forEach(page => createPage(dept, page));
    ACT_PAGES.forEach(page => createPage(dept, page));
    GOVERN_PAGES.forEach(page => createPage(dept, page));

    // Department specific
    if (DEPT_SPECIFICS[dept]) {
        DEPT_SPECIFICS[dept].forEach(page => createPage(dept, page));
    }
});
