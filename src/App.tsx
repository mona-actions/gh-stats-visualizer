/**
 * App.tsx
 *
 * The root component for the GitHub repository analysis dashboard application.
 * Manages global state for repository statistics and analysis timing, and coordinates the main UI flow.
 */

import { useState } from "react";
import Header from "./components/Header";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import type { Stats } from "@types";

/**
 * The main application component.
 * Manages state for repository statistics and analysis timing, and renders the header, upload form, and dashboard.
 *
 * @returns JSX element for the application UI.
 */
export default function App() {
  /**
   * State for the parsed repository statistics (null if not yet uploaded/analyzed).
   */
  const [stats, setStats] = useState<Stats | null>(null);
  /**
   * State for the timestamp when analysis was started (used for timing display).
   */
  const [analyzeStart, setAnalyzeStart] = useState<number | null>(null);

  return (
    <>
      <Header onReset={() => setStats(null)} />
      {!stats && (
        <Upload
          onStatsReady={setStats}
          onAnalyzeStart={() => setAnalyzeStart(performance.now())}
        />
      )}
      {stats && <Dashboard stats={stats} analyzeStart={analyzeStart} />}
    </>
  );
}
