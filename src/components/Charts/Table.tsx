/**
 * Table.tsx
 *
 * Provides the GenericTable React component and supporting types for rendering styled data tables.
 * Supports custom columns, cell rendering, row limits, and flexible table styling.
 *
 * Exports:
 * - TableRow: Data structure for a single table row.
 * - TableColumn: Configuration for a single table column.
 * - GenericTable: Main table component.
 * - GenericTableProps: Supporting prop types.
 */

import React from "react";
import {
  tableCardStyle,
  tableCardTitleStyle,
  tableStyle,
  tableCellStyle,
  tableHeaderStyle,
  tableBodyCellStyle,
  tableFirstColStyle,
} from "@styles";

/**
 * Represents a single row of data in the table.
 * Keys are column names; values can be string, number, boolean, null, or undefined.
 */
export interface TableRow {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Configuration for a single column in the table.
 * - key: The key in the data to use for this column.
 * - header: The column header label.
 * - render: Optional custom cell renderer.
 * - align: Optional alignment for the column ('left', 'right', 'center').
 */
export interface TableColumn {
  key: string;
  header: string;
  render?: (
    value: string | number | boolean | null | undefined,
    row: TableRow
  ) => React.ReactNode;
  align?: "left" | "right" | "center";
}

/**
 * Props for the GenericTable component.
 * - title: Table title.
 * - data: Array of table rows.
 * - columns: Array of column configurations.
 * - limit: Optional maximum number of rows to display.
 * - fullWidth: If true, table spans full grid width.
 * - className: Optional CSS class.
 */
export interface GenericTableProps {
  title: string;
  data: TableRow[];
  columns: TableColumn[];
  limit?: number;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Renders a generic, styled data table with customizable columns and cell rendering.
 * Supports row limits, custom alignment, and flexible styling for integration in dashboards.
 *
 * @param {GenericTableProps} props - The table configuration and data.
 * @returns {JSX.Element} The rendered table component.
 */
export function GenericTable({
  title,
  data,
  columns,
  limit,
  fullWidth = false,
  className,
}: GenericTableProps) {
  // Limit the number of rows if 'limit' is provided
  const rows = limit ? data.slice(0, limit) : data;

  return (
    <div
      style={
        fullWidth ? { ...tableCardStyle, gridColumn: "1 / -1" } : tableCardStyle
      }
      className={className}
    >
      <h3 style={tableCardTitleStyle}>
        {limit ? `${limit} ` : ""}
        {title}
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ borderBottom: "1px solid #30363d" }}>
            {columns.map((column, index) => (
              <th
                key={column.key}
                style={{
                  ...tableCellStyle,
                  ...tableHeaderStyle,
                  ...(index === 0 ? tableFirstColStyle : {}),
                  textAlign: column.align || (index === 0 ? "left" : "right"),
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                borderBottom:
                  rowIndex < rows.length - 1 ? "1px solid #21262d" : "none",
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  style={{
                    ...tableCellStyle,
                    ...tableBodyCellStyle,
                    ...(colIndex === 0 ? tableFirstColStyle : {}),
                    textAlign:
                      column.align || (colIndex === 0 ? "left" : "right"),
                  }}
                >
                  {/* If a custom render function is provided, use it; otherwise, display the raw value */}
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
