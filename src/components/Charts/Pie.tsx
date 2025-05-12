/**
 * Pie.tsx
 *
 * Provides the GenericPieChart React component and supporting types for rendering customizable pie charts using Recharts.
 * Supports custom colors, labels, tooltips, and flexible configuration for pie chart segments.
 *
 * Exports:
 * - PieDataItem: Data structure for a single pie chart data point.
 * - GenericPieChart: Main pie chart component.
 * - GenericPieChartProps: Supporting prop types.
 */

import type { ReactNode } from "react";
import type {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  chartCardStyle,
  chartContainerStyle,
  titleStyle,
  tooltipStyle,
  tooltipItemStyle,
} from "@styles";

/**
 * Represents a single data point for the pie chart.
 * The 'name' property is used for segment labeling; 'value' is the segment size.
 * Additional keys can be used for custom data.
 */
export interface PieDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Props for the GenericPieChart component.
 * - title: Chart title.
 * - data: Array of data items.
 * - dataKey: Key for the value in data (default: 'value').
 * - nameKey: Key for the name in data (default: 'name').
 * - colors: Optional array of colors for segments.
 * - height: Chart height in pixels.
 * - outerRadius: Pie outer radius.
 * - formatter: Optional value formatter for tooltips.
 * - showLabel: Whether to show labels on segments.
 * - labelFormatter: Optional label formatter for segments.
 * - className: Optional CSS class.
 * - fullWidth: If true, chart spans full grid width.
 * - pieProps: Additional props for the Pie component.
 */
export interface GenericPieChartProps {
  title: string;
  data: PieDataItem[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
  outerRadius?: number;
  formatter?: (
    value: ValueType,
    name: NameType,
    entry: Payload<ValueType, string>
  ) => ReactNode;
  showLabel?: boolean;
  labelFormatter?: (item: { name: string; percent: number }) => string;
  className?: string;
  fullWidth?: boolean;
  pieProps?: Partial<{
    dataKey: string;
    nameKey: string;
    cx?: string;
    cy?: string;
    outerRadius?: number;
    label?: boolean | ((props: { name: string; percent: number }) => string);
    style?: { fontSize?: number };
  }>;
}

/**
 * Renders a generic, highly customizable pie chart using Recharts.
 * Supports custom colors, labels, tooltips, and flexible configuration for pie chart segments.
 *
 * @param {GenericPieChartProps} props - The chart configuration and data.
 * @returns {JSX.Element} The rendered pie chart component.
 */
export function GenericPieChart({
  title,
  data,
  dataKey = "value",
  nameKey = "name",
  colors = ["#3fb950", "#58a6ff", "#ad6eff", "#f78166", "#6e7681", "#e3b341"],
  height = 300,
  outerRadius = 125,
  formatter = (value: ValueType) => String(value).toLocaleString(),
  showLabel = true,
  labelFormatter = ({ name, percent }) =>
    `${name}: ${(percent * 100).toFixed(0)}%`,
  className,
  fullWidth = false,
  pieProps = {},
}: GenericPieChartProps) {
  // Default props for the Pie component
  const defaultPieProps = {
    dataKey,
    nameKey,
    cx: "50%",
    cy: "50%",
    outerRadius,
    label: showLabel ? labelFormatter : undefined,
    style: { fontSize: 12 },
  };

  // Merge default and custom props for the Pie
  const mergedPieProps = { ...defaultPieProps, ...pieProps };

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
          <PieChart>
            {/* Render the Pie with merged props and custom colors for each segment */}
            <Pie data={data} {...mergedPieProps}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {/* Tooltip with custom value formatter */}
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={formatter}
              itemStyle={tooltipItemStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
