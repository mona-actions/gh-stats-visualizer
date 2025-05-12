/**
 * Dashboard.tsx
 *
 * Provides the main Dashboard component for rendering the repository analysis dashboard.
 * Includes the summary header, dashboard section with charts/tables, and the footer.
 */

import type { Stats } from "@types";
import { containerStyle } from "@styles";

import { DashboardSection, SummaryHeader } from "./Dashboard/Visualization";
import Footer from "./Footer";

/**
 * Props for the Dashboard component.
 * @property stats - The full repository stats object.
 * @property analyzeStart - The timestamp when analysis started (for timing display).
 */
interface DashboardProps {
  stats: Stats;
  analyzeStart: number | null;
}

/**
 * Renders the main dashboard layout, including the summary header, all charts/tables, and the footer.
 * @param props - DashboardProps with stats and analyzeStart.
 * @returns JSX element for the dashboard.
 */
export default function Dashboard({ stats, analyzeStart }: DashboardProps) {
  return (
    <div style={containerStyle}>
      <SummaryHeader
        title={`Analysis of ${stats.basic.totalRepos.toLocaleString()} repositories`}
        description={`Across ${stats.orgData.length} organizations`}
      />
      <DashboardSection stats={stats} />
      <Footer analyzeStart={analyzeStart} />
    </div>
  );
}
