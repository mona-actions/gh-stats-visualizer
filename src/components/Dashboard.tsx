/**
 * Dashboard.tsx
 *
 * Provides the main Dashboard component for rendering the repository analysis dashboard.
 * Includes the summary header, dashboard section with charts/tables, and the footer.
 */

import { useState, useMemo } from "react";
import type { Stats } from "@types";
import {
  containerStyle,
  tabContainerStyle,
  tabButtonStyle,
  activeTabStyle,
} from "@styles";

import { DashboardSection, SummaryHeader } from "./Dashboard/Visualization";
import { OrgSelector, OrgStatsSection } from "./Dashboard/OrgStats";
import MigrationWaveAnalyzer from "./Dashboard/MigrationWaveAnalyzer";
import calculateStats from "../utils/calculateStats";
import Footer from "./Footer";

type TabType = "overview" | "migration";

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
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Check if we have org data
  const hasOrgData = stats.orgs && stats.orgs.length > 0;

  // Filter repositories by selected org and recalculate stats
  const filteredStats = useMemo(() => {
    if (selectedOrg === "all") {
      return stats;
    }

    // Filter repositories to only those belonging to the selected org
    const filteredRepos = stats.repositories.filter(
      (repo) => repo.Org_Name === selectedOrg
    );

    // Recalculate stats for filtered repositories
    return calculateStats(filteredRepos, stats.orgs);
  }, [selectedOrg, stats]);

  const separatorStyle: React.CSSProperties = {
    borderTop: "1px solid #30363d",
    marginTop: "32px",
    marginBottom: "32px",
  };

  return (
    <div style={containerStyle}>
      {/* Tab Navigation */}
      <div style={tabContainerStyle}>
        <button
          style={activeTab === "overview" ? activeTabStyle : tabButtonStyle}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          style={activeTab === "migration" ? activeTabStyle : tabButtonStyle}
          onClick={() => setActiveTab("migration")}
        >
          Migration Wave Planner
        </button>
      </div>

      {/* Organization Selector (at top) */}
      {hasOrgData && (
        <OrgSelector
          orgs={stats.orgs!}
          selectedOrg={selectedOrg}
          onSelectOrg={setSelectedOrg}
        />
      )}

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === "overview" ? (
        <>
          {/* Organization Stats Section */}
          {hasOrgData && (
            <>
              <div style={separatorStyle} />
              <SummaryHeader
                title="Organization Statistics"
                description={
                  selectedOrg === "all"
                    ? `Viewing ${stats.orgs!.length} organizations`
                    : undefined
                }
              />
              <OrgStatsSection
                orgs={stats.orgs!}
                selectedOrg={selectedOrg}
              />
            </>
          )}

          {/* Repository Stats Section */}
          <div style={separatorStyle} />
          <SummaryHeader
            title="Repository Statistics"
            description={`Analysis of ${filteredStats.basic.totalRepos.toLocaleString()} repositories${selectedOrg === "all" ? ` across ${filteredStats.orgData.length} organizations` : ""}`}
          />
          <DashboardSection stats={filteredStats} />
        </>
      ) : (
        <>
          {/* Migration Wave Planner Section */}
          <div style={separatorStyle} />
          <MigrationWaveAnalyzer repositories={filteredStats.repositories} />
        </>
      )}

      <Footer analyzeStart={analyzeStart} />
    </div>
  );
}
