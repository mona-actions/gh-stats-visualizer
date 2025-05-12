/**
 * Line.tsx
 *
 * Provides the GenericLineChart React component and supporting types for rendering customizable line charts using Recharts.
 * Supports multiple lines, custom colors, flexible axis configuration, and tooltip formatting.
 *
 * Exports:
 * - LineDataItem: Data structure for a single line chart data point.
 * - LineConfig: Configuration for a single line in the chart.
 * - GenericLineChart: Main line chart component.
 * - GenericLineChartProps: Supporting prop types.
 */

import type { ReactNode } from "react";
import type {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  chartCardStyle,
  chartContainerStyle,
  titleStyle,
  tooltipStyle,
  tooltipItemStyle,
} from "@styles";

/**
 * Represents a single data point for the line chart.
 * The 'name' property is used for axis labeling; additional keys are used for line values.
 */
export interface LineDataItem {
  name: string;
  [key: string]: string | number;
}

/**
 * Configuration for a single line in the chart.
 * - dataKey: The key in the data to use for this line.
 * - name: Optional display name for the legend.
 * - stroke: Optional color override for this line.
 * - type: Optional line type (e.g., 'monotone', 'linear').
 */
export interface LineConfig {
  dataKey: string;
  name?: string;
  stroke?: string;
  type?:
    | "monotone"
    | "linear"
    | "step"
    | "stepBefore"
    | "stepAfter"
    | "basis"
    | "basisOpen"
    | "basisClosed"
    | "natural";
}

/**
 * Props for the GenericLineChart component.
 * - title: Chart title.
 * - data: Array of data items.
 * - lines: Array of line configurations.
 * - height: Chart height in pixels.
 * - colors: Optional array of colors for lines.
 * - formatter: Optional value formatter for tooltips.
 * - xAxisDataKey: Key for the X axis data.
 * - margin: Chart margin object.
 * - className: Optional CSS class.
 * - fullWidth: If true, chart spans full grid width.
 */
export interface GenericLineChartProps {
  title: string;
  data: LineDataItem[];
  lines: LineConfig[];
  height?: number;
  colors?: string[];
  formatter?: (
    value: ValueType,
    name: NameType,
    entry: Payload<ValueType, string>
  ) => ReactNode;
  xAxisDataKey?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  className?: string;
  fullWidth?: boolean;
}

/**
 * Renders a generic, highly customizable line chart using Recharts.
 * Supports multiple lines, custom colors, flexible axis configuration, and tooltip formatting.
 *
 * @param {GenericLineChartProps} props - The chart configuration and data.
 * @returns {JSX.Element} The rendered line chart component.
 */
export function GenericLineChart({
  title,
  data,
  lines,
  height = 300,
  colors = ["#3fb950", "#58a6ff", "#ad6eff", "#f78166"],
  formatter = (value: ValueType) => String(value).toLocaleString(),
  xAxisDataKey = "name",
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  className,
  fullWidth = false,
}: GenericLineChartProps) {
  return (
    <div
      style={
        fullWidth ? { ...chartCardStyle, gridColumn: "1 / -1" } : chartCardStyle
      }
      className={className}
    >
      <h3 style={titleStyle}>{title}</h3>
      <div style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            {/* X Axis for the line chart, with customizable data key */}
            <XAxis
              dataKey={xAxisDataKey}
              stroke="#8b949e"
              tick={{ fontSize: 12 }}
            />
            {/* Y Axis for the line chart */}
            <YAxis stroke="#8b949e" tick={{ fontSize: 12 }} />
            {/* Tooltip with custom value formatter */}
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={formatter}
              itemStyle={tooltipItemStyle}
            />
            {/* Show legend if more than one line */}
            {lines.length > 1 && <Legend />}
            {/* Render each line, optionally with per-line colors and types */}
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type={line.type || "monotone"}
                dataKey={line.dataKey}
                stroke={line.stroke || colors[index % colors.length]}
                name={line.name || line.dataKey}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
