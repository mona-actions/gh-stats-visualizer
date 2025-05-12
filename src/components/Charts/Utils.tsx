/**
 * Utils.tsx
 *
 * Provides chart utility functions and constants for formatting numbers, sizes, repository names, truncating text, and rendering custom axis ticks for Recharts charts.
 *
 * Exports:
 * - CHART_COLORS: Common color palette for charts.
 * - formatNumber: Formats numbers with locale separators.
 * - formatSize: Converts MB to human-readable string.
 * - formatRepoName: Extracts repo name from full path.
 * - truncateText: Truncates text to a max length with ellipsis.
 * - renderVerticalTick: Renders a custom vertical tick for chart axes.
 */

import type { ReactElement } from "react";

/**
 * Common color palette for charts.
 */
export const CHART_COLORS = {
  GREEN: "#3fb950",
  BLUE: "#58a6ff",
  PURPLE: "#ad6eff",
  ORANGE: "#f78166",
  GRAY: "#6e7681",
  YELLOW: "#e3b341",
  RED: "#ff7b72",
  LIGHT_BLUE: "#79c0ff",
};

/**
 * Formats a number with locale separators (e.g., 1,234,567).
 * @param num - The number to format.
 * @returns The formatted string.
 */
export const formatNumber = (num: number) => num.toLocaleString();

/**
 * Converts a size in MB to a human-readable string (B, KB, MB, GB, TB).
 * @param sizeMB - The size in megabytes.
 * @returns The formatted size string.
 */
export const formatSize = (sizeMB: number): string => {
  const sizeB = sizeMB * 1024 * 1024;
  if (sizeB < 1024) return `${sizeB.toFixed(0)} B`;
  if (sizeB < 1024 * 1024) return `${(sizeB / 1024).toFixed(2)} KB`;
  if (sizeB < 1024 * 1024 * 1024)
    return `${(sizeB / 1024 / 1024).toFixed(2)} MB`;
  if (sizeB < 1024 * 1024 * 1024 * 1024)
    return `${(sizeB / 1024 / 1024 / 1024).toFixed(2)} GB`;
  return `${(sizeB / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`;
};

/**
 * Extracts the repository name from a full path (e.g., 'org/repo' -> 'repo').
 * @param name - The full repository name or path.
 * @returns The extracted repository name.
 */
export const formatRepoName = (
  name: string | number | null | undefined
): string => {
  if (!name) return "";
  const nameStr = String(name);
  if (nameStr.includes("/")) {
    return nameStr.split("/").pop() || nameStr;
  }
  return nameStr;
};

/**
 * Truncates text to a maximum length, adding an ellipsis if needed.
 * @param text - The text to truncate.
 * @param maxLength - The maximum allowed length.
 * @returns The truncated text.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
};

/**
 * Props for rendering a custom vertical tick.
 */
interface TickProps {
  x: number;
  y: number;
  payload: {
    value: string | number;
  };
}

/**
 * Renders a custom vertical tick for chart axes, truncating and formatting the label as needed.
 * Used for vertical bar charts with long or complex labels.
 *
 * @param props - The tick rendering props (x, y, payload).
 * @param maxLength - Maximum label length before truncation (default: 18).
 * @returns {ReactElement<SVGElement>} The rendered SVG text element.
 */
export const renderVerticalTick = (
  { x, y, payload }: TickProps,
  maxLength = 18
): ReactElement<SVGElement> => {
  const name = formatRepoName(payload.value);
  const label = truncateText(name, maxLength);

  return (
    <text
      x={x}
      y={y}
      dy={4}
      fontSize={12}
      textAnchor="end"
      transform={`rotate(-30, ${x}, ${y})`}
      fill="#8b949e"
    >
      {label}
    </text>
  );
};
