/**
 * Upload.tsx
 *
 * Provides the Upload component for uploading and analyzing a GitHub repository CSV file.
 * Handles file selection, CSV parsing, error handling, and triggers analysis timing.
 */

import React, { useState } from "react";
import Papa from "papaparse";
import type { Stats, Repository } from "@types";
import parseCsvAndCalculateStats from "../utils/parseCsv";

/**
 * Props for the Upload component.
 * @property onStatsReady - Callback with parsed and calculated stats.
 * @property onAnalyzeStart - Optional callback to trigger analysis timing.
 */
interface UploaderProps {
  onStatsReady: (_stats: Stats) => void;
  onAnalyzeStart?: () => void;
}

/**
 * Upload component for uploading and analyzing a GitHub repository CSV file.
 * Handles file selection, CSV parsing, error handling, and triggers analysis timing.
 *
 * @param props - UploaderProps with onStatsReady and optional onAnalyzeStart.
 * @returns JSX element for the upload form and button.
 */
export default function Upload({
  onStatsReady,
  onAnalyzeStart,
}: UploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles file input change and sets the selected file.
   * @param e - The file input change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  /**
   * Handles the Analyze button click, triggers analysis timing, parses CSV, and calls onStatsReady.
   * @returns void
   */
  const handleAnalyzeClick = async () => {
    if (onAnalyzeStart) onAnalyzeStart();
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const parsed = Papa.parse<Repository>(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transform: (value, field) => {
          if (["Has_Wiki"].includes(String(field))) {
            return value === "True" ? 1 : 0;
          }
          if (
            ["Is_Empty", "Is_Fork", "Is_Archived", "Migration_Issue"].includes(
              String(field)
            )
          ) {
            return String(value).toLowerCase() === "true";
          }
          return value;
        },
      });

      if (parsed.errors.length > 0) {
        throw new Error(parsed.errors[0].message);
      }

      const stats = parseCsvAndCalculateStats(parsed.data);
      onStatsReady(stats);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to parse and process CSV file.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#161b22",
        padding: "24px",
        borderRadius: "6px",
        border: "1px solid #30363d",
        maxWidth: "600px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          color: "white",
          marginBottom: "16px",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        Upload a CSV file
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#301a1d",
            color: "#f5a1b1",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "16px",
            border: "1px solid #c93c54",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <p
        style={{
          color: "#8b949e",
          marginBottom: "16px",
          fontSize: "14px",
        }}
      >
        Import your GitHub organization's stats data to visualize key metrics and insights
      </p>

      <div
        style={{
          padding: "16px",
          border: "1px dashed #30363d",
          borderRadius: "6px",
          backgroundColor: "#0d1117",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <label
          style={{
            backgroundColor: "#f0f6fc",
            color: "#0d1117",
            padding: "6px 12px",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "6px",
            border: "1px solid #30363d",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          Choose File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <span
          style={{
            color: "#c9d1d9",
            fontSize: "14px",
            maxWidth: "70%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file ? file.name : "No file chosen"}
        </span>
      </div>

      <button
        onClick={handleAnalyzeClick}
        disabled={loading || !file}
        style={{
          backgroundColor: loading ? "#21262d" : "#238636",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: loading || !file ? "not-allowed" : "pointer",
          opacity: loading || !file ? 0.7 : 1,
          width: "100%",
          fontSize: "14px",
          fontWeight: 500,
          height: "38px",
        }}
      >
        {loading ? "Processing..." : "Analyze Repository Data"}
      </button>
    </div>
  );
}
