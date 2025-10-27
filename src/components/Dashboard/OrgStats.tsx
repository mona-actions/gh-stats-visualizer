/**
 * OrgStats.tsx
 *
 * Provides organization-level statistics visualization and org selector dropdown.
 */

import type { OrgStats } from "../../types";
import {
  gridStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  titleStyle,
  theme,
} from "../../styles";

/**
 * Props for the OrgSelector component.
 */
interface OrgSelectorProps {
  orgs: OrgStats[];
  selectedOrg: string;
  onSelectOrg: (orgLogin: string) => void;
}

/**
 * Dropdown selector for filtering by organization.
 */
export function OrgSelector({ orgs, selectedOrg, onSelectOrg }: OrgSelectorProps) {
  const containerStyle: React.CSSProperties = {
    marginTop: "24px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const selectorStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "6px",
    cursor: "pointer",
    width: "300px",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <label htmlFor="org-selector" style={titleStyle}>
        Filter by Organization
      </label>
      <select
        id="org-selector"
        value={selectedOrg}
        onChange={(e) => onSelectOrg(e.target.value)}
        style={selectorStyle}
      >
        <option value="all">All Organizations</option>
        {orgs.map((org) => (
          <option key={org.login} value={org.login}>
            {org.name || org.login}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Props for the OrgStatsSection component.
 */
interface OrgStatsSectionProps {
  orgs: OrgStats[];
  selectedOrg: string;
}

/**
 * Displays organization-level statistics in a card grid.
 */
export function OrgStatsSection({ orgs, selectedOrg }: OrgStatsSectionProps) {
  // Filter to selected org or show all orgs combined
  const displayOrgs = selectedOrg === "all" 
    ? orgs 
    : orgs.filter((org) => org.login === selectedOrg);

  if (displayOrgs.length === 0) return null;

  // Calculate aggregate stats
  const aggregateStats = {
    totalPublicRepos: displayOrgs.reduce((sum, org) => sum + org.publicRepos, 0),
    totalPrivateRepos: displayOrgs.reduce((sum, org) => sum + org.totalPrivateRepos, 0),
    totalMembers: displayOrgs.reduce((sum, org) => sum + org.membersCount, 0),
    totalTeams: displayOrgs.reduce((sum, org) => sum + org.teamsCount, 0),
    totalRunners: displayOrgs.reduce((sum, org) => sum + (org.runnersCount || 0), 0),
    totalSecrets: displayOrgs.reduce((sum, org) => sum + (org.actionsSecretsCount || 0), 0),
    totalVariables: displayOrgs.reduce((sum, org) => sum + (org.actionsVariablesCount || 0), 0),
  };

  const orgStatCards = [
    {
      label: "Public Repositories",
      value: aggregateStats.totalPublicRepos,
      color: "#3fb950",
    },
    {
      label: "Private Repositories",
      value: aggregateStats.totalPrivateRepos,
      color: "#f78166",
    },
    {
      label: "Organization Members",
      value: aggregateStats.totalMembers,
      color: "#ad6eff",
    },
    {
      label: "Teams",
      value: aggregateStats.totalTeams,
      color: "#79c0ff",
    },
    {
      label: "Self-Hosted Runners",
      value: aggregateStats.totalRunners,
      color: "#f78166",
    },
    {
      label: "Actions Secrets",
      value: aggregateStats.totalSecrets,
      color: "#ad6eff",
    },
    {
      label: "Actions Variables",
      value: aggregateStats.totalVariables,
      color: "#79c0ff",
    },
  ];

  return (
    <div style={{ marginBottom: "32px" }}>
      {/* Show org name and description when filtering to a single org */}
      {selectedOrg !== "all" && (
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ ...titleStyle, fontSize: "20px", marginBottom: "8px" }}>
            {displayOrgs[0].name || displayOrgs[0].login}
          </h4>
          {displayOrgs[0].description && (
            <p style={{ color: "#8b949e", marginBottom: "0", fontSize: "14px" }}>
              {displayOrgs[0].description}
            </p>
          )}
        </div>
      )}

      <div style={gridStyle}>
        {orgStatCards.map((stat, index) => (
          <div key={index} style={statCardStyle}>
            <div style={statLabelStyle}>{stat.label}</div>
            <div style={{ ...statValueStyle, color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {selectedOrg !== "all" && (
        <div style={{ marginTop: "16px", fontSize: "14px", color: "#8b949e" }}>
          {displayOrgs[0].blog && (
            <div style={{ marginBottom: "8px" }}>
              <strong>Website:</strong>{" "}
              <a
                href={displayOrgs[0].blog}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#58a6ff", textDecoration: "none" }}
              >
                {displayOrgs[0].blog}
              </a>
            </div>
          )}
          {displayOrgs[0].location && (
            <div style={{ marginBottom: "8px" }}>
              <strong>Location:</strong> {displayOrgs[0].location}
            </div>
          )}
          {displayOrgs[0].email && (
            <div style={{ marginBottom: "8px" }}>
              <strong>Email:</strong> {displayOrgs[0].email}
            </div>
          )}
          {displayOrgs[0].createdAt && (
            <div>
              <strong>Created:</strong>{" "}
              {new Date(displayOrgs[0].createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

