/**
 * styles.ts
 *
 * Provides design tokens, layout, typography, chart/table helpers, and global CSS injection for the dashboard application.
 * Exports a theme object, reusable style objects for components, and injects global CSS variables and styles.
 */

import type { CSSProperties } from "react";

/**
 * Design token palette for theme colors, spacing, and radii.
 */
export const theme = {
  colors: {
    bg: "#0d1117",
    card: "#161b22",
    border: "#30363d",
    text: "#c9d1d9",
    accent: "#2f81f7",
    subtle: "#8b949e",
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { sm: 6, md: 8 },
};

/**
 * Main container style for the dashboard layout.
 */
export const containerStyle: CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: `0 ${theme.space.md}px ${theme.space.lg * 2}px`,
};

/**
 * Grid style for stat cards and dashboard sections.
 */
export const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: theme.space.lg,
  alignItems: "stretch",
  marginBottom: theme.space.lg,
};

/**
 * Style for chart grid cells.
 */
export const chartCellStyle: CSSProperties = {
  gridColumn: "span 2",
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
  height: "100%",
};

/**
 * Card style for dashboard surfaces.
 */
export const cardStyle: CSSProperties = {
  backgroundColor: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  boxShadow: "0 1px 3px rgba(0,0,0,.2)",
};

/**
 * Card style for chart containers.
 */
export const chartCardStyle: CSSProperties = {
  ...cardStyle,
  padding: theme.space.md,
  display: "flex",
  flexDirection: "column",
  gap: theme.space.lg,
  height: "100%",
  boxSizing: "border-box",
};

/**
 * Card style for stat cards.
 */
export const statCardStyle: CSSProperties = {
  ...cardStyle,
  padding: theme.space.md,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

/**
 * Typography styles for titles, subtitles, stat labels, and values.
 */
export const titleStyle: CSSProperties = {
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: 600,
  margin: 0,
};

export const subtitleStyle: CSSProperties = {
  color: theme.colors.subtle,
  fontSize: 14,
  margin: 0,
};

export const statLabelStyle: CSSProperties = {
  color: theme.colors.subtle,
  fontSize: 14,
  margin: 0,
};

export const statValueStyle: CSSProperties = {
  color: theme.colors.accent,
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
};

/**
 * Chart helper styles and constants.
 */
export const chartContainerStyle: CSSProperties = { flex: 1, minHeight: 0 };
export const chartMargin = { top: 20, right: 30, left: 20, bottom: 5 } as const;

export const tooltipStyle: CSSProperties = {
  backgroundColor: theme.colors.bg,
  borderColor: theme.colors.border,
  color: theme.colors.text,
  borderRadius: theme.radius.sm,
  fontSize: 12,
};
export const tooltipItemStyle: CSSProperties = { color: theme.colors.text };

/**
 * Footer style for the dashboard.
 */
export const footerStyle: CSSProperties = {
  textAlign: "center",
  padding: `${theme.space.lg}px 0`,
  borderTop: `1px solid ${theme.colors.border}`,
  color: theme.colors.subtle,
  fontSize: 12,
};

/**
 * Grid style for tables.
 */
export const tablesGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.space.lg,
};

/**
 * Card and table styles for tables.
 */
export const tableCardStyle: CSSProperties = {
  ...cardStyle,
  padding: `${theme.space.lg + theme.space.md}px ${theme.space.md}px`,
  display: "block",
};

export const tableCardTitleStyle: CSSProperties = {
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: 600,
  margin: `0 0 ${theme.space.md + theme.space.sm}px 0`,
};

export const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

export const tableCellStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: 15,
};

export const tableFirstColStyle: CSSProperties = {
  whiteSpace: "nowrap",
  fontWeight: 500,
  textAlign: "left",
};

export const tableHeaderStyle: CSSProperties = {
  color: theme.colors.subtle,
  fontWeight: 600,
};

export const tableBodyCellStyle: CSSProperties = { color: theme.colors.text };

/**
 * Injects global CSS variables and styles for the dashboard theme and tables.
 * This runs once on module load.
 */
function camelToKebab(s: string) {
  return s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function objToCss(obj: CSSProperties) {
  return Object.entries(obj)
    .map(([k, v]) => `${camelToKebab(k)}:${v};`)
    .join("");
}

(function injectGlobalCss() {
  const root = document.documentElement;
  root.style.setProperty("--color-bg", theme.colors.bg);
  root.style.setProperty("--color-card", theme.colors.card);
  root.style.setProperty("--color-border", theme.colors.border);
  root.style.setProperty("--color-text", theme.colors.text);
  root.style.setProperty("--color-accent", theme.colors.accent);

  const global = `
      body{
        margin:0;padding:0;
        background:var(--color-bg);
        color:var(--color-text);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
      }
      button,input,select,textarea{
        font: inherit;
      }
      .table-card{${objToCss(tableCardStyle)}}
      .table-card h3{${objToCss(tableCardTitleStyle)}}
      .table-card table{width:100%;border-collapse:collapse;}
      .table-card th,.table-card td{${objToCss(tableCellStyle)}}
      .table-card th{${objToCss(tableHeaderStyle)}}
      .table-card td{${objToCss(tableBodyCellStyle)}}
    `;
  const style = document.createElement("style");
  style.textContent = global;
  document.head.appendChild(style);
})();

/**
 * Grid style for the main dashboard chart and table layout.
 */
export const dashboardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "24px",
  marginBottom: "24px",
  marginTop: "24px",
};
