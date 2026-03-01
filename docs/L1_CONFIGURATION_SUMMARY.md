# IntegrateWise L1 Configuration Summary

## Overview

This document outlines the "Pure L1" configuration implemented to provide a clean, work-focused environment while ensuring core intelligence features are available by default.

## 1. Default Modules (The "Base Bag")

All user roles (Personal, Founder, Sales, Ops, etc.) now include the following **5 Core Modules** by default:

1. **Home** (`/personal`) - The Dashboard.
2. **Projects** (`/projects`) - Project Management.
3. **Data Explorer** (`/spine`) - formerly "Spine". Access to all connected structured data.
4. **Library** (`/context`) - formerly "Context". access to documents, emails, and meetings.
5. **AI Chats** (`/knowledge`) - formerly "Knowledge". Access to saved AI conversations.

*Note: These are added to the `baseBag` in `workspace-bag.ts`, ensuring they are present for all new workspaces.*

## 2. Navigation Structure (OsShell)

The Side Navigation has been streamlined to remove L2 "Think" and "Act" complexity by default, using user-friendly names:

* **Core**: Dashboard, Today, Tasks, Goals
* **Department**: Role-specific views (e.g., Sales Pipeline, Marketing Campaigns)
* **Intelligence**:
  * **Data Explorer** (Spine)
  * **Library** (Context)
  * **AI Chats** (Knowledge)
* **Act**: Workflows, Automations (Available but collapsed)
* **Governance**: Audit, Evidence (Available but collapsed)

## 3. Removed L2 Features

To ensure a "Pure Work" experience, the following modules are **NOT** unlocked by default (require specific hydration levels B5/B7):

* **Risks** (Churn/Health scoring)
* **Signals** (Predictive alerts)
* **Expansion** (Opportunity detection)
* **Agents** (Autonomous workers)

## 4. UI Updates

* **OsShell**: Refactored to use the new navigation structure and labels.
* **SmartSidebar**: Updated to support the simplified intelligence section.
* **OsHomeViewWired**: Cleaned of "Think Layer" insights and "Cognitive Twin" branding to focus on Inbox, Work, and Data.

## 5. Wiring Details

* **Router**: `/knowledge` maps to AI Chats, `/spine` maps to Data Explorer, `/context` maps to Library.
* **Icons**:
  * Data Explorer: `Database`
  * Library: `FileText`
  * AI Chats: `BookOpen`
