/**
 * Bar.tsx
 *
 * Provides the GenericBarChart React component and supporting types for rendering customizable bar charts using Recharts.
 * Includes flexible axis, color, and layout options for both horizontal and vertical bar charts.
 *
 * Exports:
 * - DataItem: Data structure for a single bar chart data point.
 * - GenericBarConfig: Configuration for a single bar in the chart.
 * - GenericBarChart: Main bar chart component.
 * - AxisProps, GenericBarChartProps: Supporting prop types.
 */

import type { ReactNode, ReactElement } from "react";
import type {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  chartCardStyle,
  chartContainerStyle,
  titleStyle,
  tooltipStyle,
  tooltipItemStyle,
} from "@styles";

/**
 * Represents a single data point for the bar chart.
 * The 'name' property is used for axis labeling; additional keys are used for bar values.
 */
export interface DataItem {
  name: string;
  [key: string]: string | number;
}

/**
 * Configuration for a single bar in the chart.
 * - dataKey: The key in the data to use for this bar.
 * - name: Optional display name for the legend.
 * - fill: Optional color override for this bar.
 * - stackId: Optional stack group for stacked bar charts.
 */
export interface GenericBarConfig {
  dataKey: string;
  name?: string;
  fill?: string;
  stackId?: string;
}

/**
 * Axis configuration props for XAxis and YAxis.
 * Allows for custom tick rendering and axis styling.
 */
interface AxisProps {
  type?: "number" | "category";
  dataKey?: string;
  stroke?: string;
  width?: number;
  tick?:
    | {
        fontSize?: number;
      }
    | ((props: {
        x: number;
        y: number;
        payload: { value: string | number };
      }) => ReactElement<SVGElement>);
}

/**
 * Props for the GenericBarChart component.
 * - title: Chart title.
 * - data: Array of data items.
 * - bars: Array of bar configurations.
 * - layout: 'horizontal' or 'vertical'.
 * - height: Chart height in pixels.
 * - colors: Optional array of colors for bars.
 * - renderCustomTick: Optional custom tick renderer for axes.
 * - formatter: Optional value formatter for tooltips.
 * - labelFormatter: Optional label formatter for tooltips.
 * - margin: Chart margin object.
 * - XAxisProps, YAxisProps: Additional axis props.
 * - className: Optional CSS class.
 * - fullWidth: If true, chart spans full grid width.
 */
export interface GenericBarChartProps {
  title: string;
  data: DataItem[];
  bars: GenericBarConfig[];
  layout?: "horizontal" | "vertical";
  height?: number;
  colors?: string[];
  renderCustomTick?: (props: {
    x: number;
    y: number;
    payload: { value: string | number };
  }) => ReactElement<SVGElement>;
  formatter?: (
    value: ValueType,
    name: NameType,
    entry: Payload<ValueType, string>
  ) => ReactNode;
  labelFormatter?: (label: string) => ReactNode;
  margin?: { top: number; right: number; left: number; bottom: number };
  XAxisProps?: Partial<AxisProps>;
  YAxisProps?: Partial<AxisProps>;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Renders a generic, highly customizable bar chart using Recharts.
 * Supports both horizontal and vertical layouts, stacked bars, custom colors, and custom axis ticks.
 *
 * @param {GenericBarChartProps} props - The chart configuration and data.
 * @returns {JSX.Element} The rendered bar chart component.
 */
export function GenericBarChart({
  title,
  data,
  bars,
  layout = "horizontal",
  height = 300,
  colors,
  renderCustomTick,
  formatter = (value: ValueType) => String(value).toLocaleString(),
  labelFormatter,
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  XAxisProps = {},
  YAxisProps = {},
  className,
  fullWidth = false,
}: GenericBarChartProps) {
  // Determine if the chart is vertical (bars go left-to-right)
  const isVertical = layout === "vertical";

  // Default props for axes based on layout
  const defaultXAxisProps: AxisProps = isVertical
    ? { type: "number", stroke: "#8b949e", tick: { fontSize: 12 } }
    : {
        type: "category",
        dataKey: "name",
        stroke: "#8b949e",
        tick: { fontSize: 12 },
      };

  const defaultYAxisProps: AxisProps = isVertical
    ? { type: "category", dataKey: "name", width: 90, stroke: "#8b949e" }
    : { type: "number", stroke: "#8b949e", tick: { fontSize: 12 } };

  // Merge default and custom props for axes
  const xAxisProps = { ...defaultXAxisProps, ...XAxisProps };
  const yAxisProps = { ...defaultYAxisProps, ...YAxisProps };

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
          <BarChart data={data} layout={layout} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />

            {/* X Axis with optional custom tick renderer */}
            <XAxis {...xAxisProps} tick={renderCustomTick || xAxisProps.tick} />

            {/* Y Axis with optional custom tick renderer for vertical charts */}
            <YAxis
              {...yAxisProps}
              tick={
                renderCustomTick && isVertical
                  ? renderCustomTick
                  : yAxisProps.tick
              }
            />

            {/* Tooltip with custom value and label formatters */}
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={formatter}
              itemStyle={tooltipItemStyle}
              labelFormatter={labelFormatter}
            />

            {/* Show legend if more than one bar */}
            {bars.length > 1 && <Legend />}

            {/* Render each bar, optionally with per-bar or per-cell colors */}
            {bars.map((bar: GenericBarConfig, index: number) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name || bar.dataKey}
                fill={
                  bar.fill ||
                  (colors ? colors[index % colors.length] : "#238636")
                }
                stackId={bar.stackId}
              >
                {/* If colors are provided and no bar.fill, color each cell individually */}
                {colors &&
                  !bar.fill &&
                  data.map((_: DataItem, idx: number) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={colors[idx % colors.length]}
                    />
                  ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
