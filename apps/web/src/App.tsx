/**
 * IntegrateWise — Universal Cognitive Operating System
 *
 * Unified entry point merging:
 *   - Marketing site (Anti-Gravity design, Dir 1)
 *   - Workspace app (Business Operations, Dir 2)
 *   - Backend services (integratewise-complete, Dir 3)
 *
 * "AI That Thinks in Context, Waits for Approvals."
 */

import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}
