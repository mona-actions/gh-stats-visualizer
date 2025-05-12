/**
 * Header.tsx
 *
 * Provides the Header component for the dashboard, displaying the app title, GitHub logo, and an upload/reset button.
 * The header allows users to reset the analysis and upload a new file.
 */

import GitHubLogo from "./GitHubLogo";

/**
 * Props for the Header component.
 * @property onReset - Callback function to reset the analysis/upload a new file.
 */
interface HeaderProps {
  onReset: () => void;
}

/**
 * Renders the dashboard header with the GitHub logo, app title, and upload/reset button.
 * @param props - HeaderProps with onReset callback.
 * @returns JSX element for the header.
 */
export default function Header({ onReset }: HeaderProps) {
  return (
    <header
      style={{
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d",
        padding: "16px 0",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <GitHubLogo size={32} style={{ marginRight: "16px" }} />
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "white" }}>
            GitHub Stats Analyzer
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            backgroundColor: "#238636",
            color: "white",
            padding: "5px 16px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
            height: "32px",
          }}
        >
          Upload New File
        </button>
      </div>
    </header>
  );
}
