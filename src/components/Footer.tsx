/**
 * Footer.tsx
 *
 * Provides the Footer component for the dashboard, displaying credits and page generation time.
 * Shows a heart, GitHub logo, and the Expert Services Team credit, as well as the time taken to generate the page after analysis is triggered.
 */

import { useMemo } from "react";
import { footerStyle } from "../styles";
import GitHubLogo from "./GitHubLogo";

/**
 * Renders the dashboard footer with credits and page generation time.
 * @param analyzeStart - The timestamp when analysis started (for timing display).
 * @returns JSX element for the footer.
 */
export default function Footer({
  analyzeStart,
}: {
  analyzeStart: number | null;
}) {
  /**
   * Calculate render time (in seconds) since the analyze button was clicked.
   * Only updates when analyzeStart changes.
   */
  const renderTime = useMemo(() => {
    if (!analyzeStart) return null;
    return ((performance.now() - analyzeStart) / 1000).toFixed(2);
  }, [analyzeStart]);

  return (
    <footer style={footerStyle}>
      <p style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        Made with
        <span
          style={{
            color: "#f85149",
            fontSize: "1.5em",
            lineHeight: 1,
            margin: "0 4px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          ♥
        </span>
        by
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            margin: "0 4px",
          }}
        >
          <GitHubLogo size={18} />
        </span>
        Expert Services Team
      </p>
      <p style={{ marginTop: "8px" }}>
        <span style={{ color: "#8b949e", fontSize: "0.95em" }}>
          Page generated in {renderTime} seconds 🚀
        </span>
      </p>
    </footer>
  );
}
