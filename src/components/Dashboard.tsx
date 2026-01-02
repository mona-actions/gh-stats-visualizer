/**
 * Dashboard.tsx
 *
 * Provides the main Dashboard component for rendering the repository analysis dashboard.
 * Includes the summary header, dashboard section with charts/tables, and the footer.
 */

import { useState, useMemo, useRef, useEffect } from "react";
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
 * Tab configuration for dynamic rendering and navigation.
 */
const TABS: Array<{ id: TabType; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "migration", label: "Migration Wave Planner" },
];

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
  const tabRefs = useRef<Record<TabType, HTMLButtonElement | null>>({
    overview: null,
    migration: null,
  });

  // Focus management: move focus to active tab after keyboard navigation
  useEffect(() => {
    // Only focus if the tab change wasn't triggered by a click (which already has focus)
    // We use a small timeout to ensure the ref is updated after state change
    const timeoutId = setTimeout(() => {
      tabRefs.current[activeTab]?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [activeTab]);

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

  /**
   * Handle keyboard navigation for tabs (Left/Right arrow keys).
   * Follows WAI-ARIA tab pattern for accessible keyboard interaction.
   * Dynamically calculates next/previous tab based on current position.
   */
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // Move to previous tab, wrap to end if at start
      newIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Move to next tab, wrap to start if at end
      newIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = TABS.length - 1;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(TABS[newIndex].id);
    }
  };

  const separatorStyle: React.CSSProperties = {
    borderTop: "1px solid #30363d",
    marginTop: "32px",
    marginBottom: "32px",
  };

  return (
    <div style={containerStyle}>
      {/* Tab Navigation */}
      <div style={tabContainerStyle} role="tablist" aria-label="Dashboard sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            id={`${tab.id}-tab`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            style={activeTab === tab.id ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={handleTabKeyDown}
          >
            {tab.label}
          </button>
        ))}
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
        <div
          id="overview-panel"
          role="tabpanel"
          aria-labelledby="overview-tab"
        >
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
        </div>
      ) : (
        <div
          id="migration-panel"
          role="tabpanel"
          aria-labelledby="migration-tab"
        >
          <>
          {/* Migration Wave Planner Section */}
          <div style={separatorStyle} />
          <MigrationWaveAnalyzer repositories={filteredStats.repositories} />
          </>
        </div>
      )}

      <Footer analyzeStart={analyzeStart} />
    </div>
  );
}
