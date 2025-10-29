# GitHub Stats Visualizer

A static web application that visualizes GitHub statistics and collaboration patterns. Try it [here](https://mona-actions.github.io/gh-stats-visualizer)

<!-- Option 1: Local image (recommended) -->
![GitHub Stats Analyzer Upload](./assets/gh-stats-visualizer-upload.png)

![GitHub Stats Analyzer Dashboard](./assets/gh-stats-visualizer-dashboard.png)


## Features

- 📊 Interactive dashboard with multiple visualization types
- 📈 Time-based analysis of repository activity
- 👥 Collaboration pattern insights
- 🎨 Modern, responsive UI
- ⚡ Fast performance with Vite, React and Typescript
- 🏢 Organization-level statistics and filtering
- 📦 JSON input from gh-github-stats

## Data Format

Use the JSON output from [`gh-github-stats`](https://github.com/cvega/gh-github-stats):

```bash
# Generate comprehensive stats
gh github-stats run --org your-org

# Upload the generated repo-stats.json to the visualizer
```

The JSON format includes:
- **Organization metadata**: Members, teams, settings, secrets, variables
- **Repository statistics**: 150+ fields per repository
- **Migration-ready data**: Everything needed for GitHub migrations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## CSV Format Requirements

The stats visualizer requires a CSV file with specific headers to properly parse and analyze your GitHub repository data. The CSV must include the following headers in any order:

### Required CSV Headers

```
Org_Name,Repo_Name,Is_Empty,Last_Push,Last_Update,Is_Fork,Is_Archived,Repo_Size_MB,Collaborator_Count,Protected_Branch_Count,Milestone_Count,Issue_Count,Pull_Request_Count,PR_Review_Count,PR_Review_Comment_Count,Commit_Comment_Count,Issue_Comment_Count,Issue_Event_Count,Release_Count,Project_Count,Branch_Count,Tag_Count,Discussion_Count,Has_Wiki,Repo_URL,Migration_Issue,Created
```

### Header Descriptions

| Header | Type | Description |
|--------|------|-------------|
| `Org_Name` | string | Organization or user name that owns the repository |
| `Repo_Name` | string | Name of the repository |
| `Repo_Size_MB` | number | Size of the repository in megabytes |
| `Issue_Count` | number | Total number of issues in the repository |
| `Pull_Request_Count` | number | Total number of pull requests |
| `Commit_Comment_Count` | number | Total number of commit comments |
| `Milestone_Count` | number | Total number of milestones |
| `Release_Count` | number | Total number of releases |
| `Tag_Count` | number | Total number of tags |
| `Issue_Comment_Count` | number | Total number of issue comments |
| `PR_Review_Comment_Count` | number | Total number of PR review comments |
| `Branch_Count` | number | Total number of branches |
| `Last_Push` | string | ISO 8601 timestamp of the last push |
| `Created` | string | ISO 8601 timestamp when the repository was created |
| `Collaborator_Count` | number | Number of collaborators with access |
| `Protected_Branch_Count` | number | Number of protected branches |
| `Project_Count` | number | Number of projects in the repository |
| `Has_Wiki` | number | Whether the repository has a wiki (1 for true, 0 for false) |
| `Discussion_Count` | number | Total number of discussions |
| `PR_Review_Count` | number | Total number of PR reviews |
| `Issue_Event_Count` | number | Total number of issue events |
| `Is_Empty` | boolean | Whether the repository is empty (true/false) |
| `Is_Fork` | boolean | Whether the repository is a fork (true/false) |
| `Is_Archived` | boolean | Whether the repository is archived (true/false) |
| `Last_Update` | string | ISO 8601 timestamp of the last update |
| `Repo_URL` | string | URL of the repository |
| `Migration_Issue` | boolean | Whether there are migration issues (true/false) |

### Sample CSV Row

```csv
myorg,awesome-project,false,2024-12-15T10:30:00.000Z,2024-12-15T09:45:00.000Z,false,false,250.5,5,2,3,15,8,12,25,10,30,5,2,1,10,3,8,1,https://github.com/myorg/awesome-project,false,2024-01-15T08:00:00.000Z
```

**Note:** All headers must be present in the CSV file for the application to parse the data correctly. Missing headers will result in parsing errors.

## Adding a New Dashboard Chart

The application is designed to be easily extensible. Here's how to add a new chart component:

1. Add your chart component to `src/components/Dashboard/Components.tsx`:
   ```typescript
   // Inside src/components/Dashboard/Components.tsx
   
   // Add your chart component
   function NewChart({ data }: ChartProps) {
     return (
       <div className="chart-container">
         {/* Your chart implementation */}
       </div>
     );
   }
   
   // Add it to the DashboardComponents object
   export const DashboardComponents = {
     // ... existing components
     newChart: NewChart,
   };
   ```

2. The chart will automatically be available in the dashboard through the `DashboardComponents` object.

3. Style your chart using the shared styles in `src/styles.ts`

### Available Chart Types

The application provides several generic chart components that you can use:

1. **Bar Chart** (`GenericBarChart`)
   ```typescript
   interface BarChartProps {
     title: string;
     data: { name: string; value: number }[];
     bars: { dataKey: string; name: string; fill: string }[];
     formatter?: (value: ValueType) => string;
     XAxisProps?: object;
   }
   ```

2. **Pie Chart** (`GenericPieChart`)
   ```typescript
   interface PieChartProps {
     title: string;
     data: { name: string; value: number }[];
     colors: string[];
     formatter?: (value: ValueType) => string;
   }
   ```

3. **Line Chart** (`GenericLineChart`)
   ```typescript
   interface LineChartProps {
     title: string;
     data: { name: string; value: number }[];
     lines: { dataKey: string; name: string; stroke: string }[];
     formatter?: (value: ValueType) => string;
   }
   ```

4. **Table** (`GenericTable`)
   ```typescript
   interface TableProps {
     title: string;
     data: any[];
     columns: { key: string; label: string; render?: (value: any) => ReactNode }[];
     limit?: number;
     fullWidth?: boolean;
   }
   ```

### Chart Component Guidelines

- Use TypeScript for type safety
- Follow the existing chart component patterns
- Implement responsive design
- Include loading and error states
- Add tooltips for data points
- Use the shared color palette from `CHART_COLORS`

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Charts/             # Chart visualization components
│   │   │   ├── Bar.tsx         # Bar chart component
│   │   │   ├── Line.tsx        # Line chart component
│   │   │   ├── Pie.tsx         # Pie chart component
│   │   │   ├── Table.tsx       # Table visualization
│   │   │   ├── Utils.tsx       # Shared chart utilities
│   │   │   └── index.ts        # Chart exports
│   │   ├── Dashboard/          # Dashboard components
│   │   │   └── Visualization.tsx  # Dashboard layout and components
│   │   ├── Dashboard.tsx       # Main dashboard container
│   │   ├── Footer.tsx          # Application footer
│   │   ├── GitHubLogo.tsx      # GitHub logo component
│   │   ├── Header.tsx          # Application header
│   │   └── Upload.tsx          # File upload component
│   ├── utils/
│   │   ├── calculateStats.ts   # Statistics calculation utilities
│   │   ├── generateTestData.ts # Test data generation
│   │   └── parseCsv.ts         # CSV parsing utilities
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Application entry point
│   ├── styles.ts              # Shared styles
│   └── types.ts               # TypeScript type definitions
├── public/                    # Static assets
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Credits

Built with ❤️ by the :octocat: Expert Services Team