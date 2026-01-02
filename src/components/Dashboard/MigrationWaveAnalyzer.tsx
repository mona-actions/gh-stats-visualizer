/**
 * MigrationWaveAnalyzer.tsx
 *
 * Component for analyzing and visualizing repository migration waves.
 * Allows users to configure classification thresholds and view generated migration waves.
 */

import { useState, useMemo } from 'react';
import type { Repository, ClassificationThresholds, MigrationWave } from '../../types';
import {
  generateMigrationWaves,
  DEFAULT_THRESHOLDS,
} from '../../utils/calculateMigrationWaves';
import {
  cardStyle,
  gridStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  titleStyle,
  subtitleStyle,
  inputLabelStyle,
  inputStyle,
  inputGroupStyle,
  inputFieldStyle,
  dashboardGridStyle,
  theme,
} from '../../styles';
import { GenericBarChart, GenericPieChart, GenericTable, CHART_COLORS } from '../Charts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatNumber } from '../Charts/Utils';

interface MigrationWaveAnalyzerProps {
  repositories: Repository[];
}

/**
 * Stat card component for displaying migration wave statistics.
 */
function StatCard({
  title,
  value,
  color = '#238636',
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div style={statCardStyle}>
      <div style={statLabelStyle}>{title}</div>
      <div style={{ ...statValueStyle, color }}>{value}</div>
    </div>
  );
}

/**
 * Input field component for threshold controls.
 */
function ThresholdInput({
  label,
  value,
  onChange,
  min,
  error,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  error?: boolean;
}) {
  return (
    <div style={inputFieldStyle}>
      <label style={inputLabelStyle}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min || 0}
        style={{
          ...inputStyle,
          borderColor: error ? '#f85149' : undefined,
        }}
      />
    </div>
  );
}

/**
 * Expandable wave detail component.
 */
function WaveDetailCard({ wave }: { wave: MigrationWave }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalSize = wave.repos.reduce((sum, repo) => sum + repo.sizeMB, 0);
  const totalMetadata = wave.repos.reduce((sum, repo) => sum + repo.metadataRecords, 0);
  const avgSize = totalSize / wave.repos.length;
  const avgMetadata = totalMetadata / wave.repos.length;

  return (
    <div style={{ ...cardStyle, padding: theme.space.md, marginBottom: theme.space.md }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ flex: 1 }}>
          <h4 style={{ ...titleStyle, margin: 0, fontSize: 15 }}>
            Wave {wave.waveNum} - {wave.org}
          </h4>
          <div style={{ ...subtitleStyle, marginTop: 4, fontSize: 12 }}>
            {wave.repos.length} repos • {wave.type} • {totalSize.toFixed(0)} MB • {totalMetadata.toLocaleString()} metadata records
          </div>
        </div>
        <div style={{ color: theme.colors.subtle, fontSize: 18 }}>
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: theme.space.md, borderTop: `1px solid ${theme.colors.border}`, paddingTop: theme.space.md }}>
          {/* Wave Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.space.md, marginBottom: theme.space.md }}>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.subtle }}>Avg Size</div>
              <div style={{ fontSize: 14, color: theme.colors.text, fontWeight: 600 }}>{avgSize.toFixed(1)} MB</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.subtle }}>Avg Metadata</div>
              <div style={{ fontSize: 14, color: theme.colors.text, fontWeight: 600 }}>{avgMetadata.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.subtle }}>Total Size</div>
              <div style={{ fontSize: 14, color: theme.colors.text, fontWeight: 600 }}>{totalSize.toFixed(1)} MB</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.subtle }}>Total Metadata</div>
              <div style={{ fontSize: 14, color: theme.colors.text, fontWeight: 600 }}>{totalMetadata.toLocaleString()}</div>
            </div>
          </div>

          {/* Repository List */}
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.subtle }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Repository</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Organization</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600 }}>Size (MB)</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600 }}>Metadata</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600 }}>Category</th>
                </tr>
              </thead>
              <tbody>
                {wave.repos.map((repo, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                    <td style={{ padding: '8px 12px', color: theme.colors.subtle }}>{idx + 1}</td>
                    <td style={{ padding: '8px 12px', color: theme.colors.text }}>{repo.repoName}</td>
                    <td style={{ padding: '8px 12px', color: theme.colors.subtle, fontSize: 12 }}>{repo.orgName}</td>
                    <td style={{ padding: '8px 12px', color: theme.colors.text, textAlign: 'right' }}>{repo.sizeMB.toFixed(1)}</td>
                    <td style={{ padding: '8px 12px', color: theme.colors.text, textAlign: 'right' }}>{repo.metadataRecords.toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: repo.sizeCategory === 'small' ? '#1a7f3714' : repo.sizeCategory === 'medium' ? '#388bfd14' : '#db614514',
                        color: repo.sizeCategory === 'small' ? '#3fb950' : repo.sizeCategory === 'medium' ? '#58a6ff' : '#f85149',
                      }}>
                        {repo.sizeCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Organization summary component.
 */
function OrgSummary({ orgName, waves }: { orgName: string; waves: MigrationWave[] }) {
  const totalRepos = waves.reduce((sum, wave) => sum + wave.repos.length, 0);
  const avgReposPerWave = totalRepos / waves.length;
  const totalSize = waves.reduce((sum, wave) => 
    sum + wave.repos.reduce((s, r) => s + r.sizeMB, 0), 0
  );
  const totalMetadata = waves.reduce((sum, wave) => 
    sum + wave.repos.reduce((s, r) => s + r.metadataRecords, 0), 0
  );

  const wavesByType = {
    small: waves.filter(w => w.type === 'small').length,
    medium: waves.filter(w => w.type === 'medium').length,
    large: waves.filter(w => w.type === 'large').length,
  };

  return (
    <div style={{ ...cardStyle, padding: theme.space.lg, marginBottom: theme.space.lg, backgroundColor: '#1c1f24' }}>
      <h3 style={{ ...titleStyle, margin: 0, marginBottom: theme.space.sm, fontSize: 18 }}>
        {orgName}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: theme.space.md }}>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.subtle }}>Total Waves</div>
          <div style={{ fontSize: 20, color: theme.colors.accent, fontWeight: 700 }}>{waves.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.subtle }}>Total Repositories</div>
          <div style={{ fontSize: 20, color: theme.colors.accent, fontWeight: 700 }}>{totalRepos}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.subtle }}>Avg Repos/Wave</div>
          <div style={{ fontSize: 20, color: theme.colors.accent, fontWeight: 700 }}>{avgReposPerWave.toFixed(1)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.subtle }}>Total Size</div>
          <div style={{ fontSize: 20, color: theme.colors.accent, fontWeight: 700 }}>{totalSize.toFixed(0)} MB</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.subtle }}>Total Metadata</div>
          <div style={{ fontSize: 20, color: theme.colors.accent, fontWeight: 700 }}>{totalMetadata.toLocaleString()}</div>
        </div>
      </div>
      <div style={{ marginTop: theme.space.md, paddingTop: theme.space.md, borderTop: `1px solid ${theme.colors.border}`, display: 'flex', gap: theme.space.lg, fontSize: 13 }}>
        <div>
          <span style={{ color: theme.colors.subtle }}>Small waves: </span>
          <span style={{ color: CHART_COLORS.GREEN, fontWeight: 600 }}>{wavesByType.small}</span>
        </div>
        <div>
          <span style={{ color: theme.colors.subtle }}>Medium waves: </span>
          <span style={{ color: CHART_COLORS.BLUE, fontWeight: 600 }}>{wavesByType.medium}</span>
        </div>
        <div>
          <span style={{ color: theme.colors.subtle }}>Large waves: </span>
          <span style={{ color: CHART_COLORS.ORANGE, fontWeight: 600 }}>{wavesByType.large}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main component for migration wave analysis.
 */
export default function MigrationWaveAnalyzer({ repositories }: MigrationWaveAnalyzerProps) {
  const [thresholds, setThresholds] = useState<ClassificationThresholds>(DEFAULT_THRESHOLDS);

  // Validate thresholds
  const hasError = useMemo(() => {
    return (
      thresholds.smallSizeMB >= thresholds.largeSizeMB ||
      thresholds.smallMetadata >= thresholds.largeMetadata
    );
  }, [thresholds]);

  // Generate migration waves
  const result = useMemo(() => {
    if (hasError) return null;
    try {
      return generateMigrationWaves(repositories, thresholds);
    } catch (error) {
      console.error('Error generating migration waves:', error);
      return null;
    }
  }, [repositories, thresholds, hasError]);

  // Prepare data for visualizations
  const sizeDistributionData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Small', value: result.stats.smallRepos, fill: CHART_COLORS.GREEN },
      { name: 'Medium', value: result.stats.mediumRepos, fill: CHART_COLORS.BLUE },
      { name: 'Large', value: result.stats.largeRepos, fill: CHART_COLORS.ORANGE },
    ].filter(item => item.value > 0);
  }, [result]);

  const waveTypeDistributionData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Small Repo Waves', value: result.stats.smallWaves, fill: CHART_COLORS.GREEN },
      { name: 'Medium Repo Waves', value: result.stats.mediumWaves, fill: CHART_COLORS.BLUE },
      { name: 'Large Repo Waves', value: result.stats.largeWaves, fill: CHART_COLORS.ORANGE },
    ].filter(item => item.value > 0);
  }, [result]);

  const reposPerWaveData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: 'Small',
        average: result.stats.avgSmallWaveSize,
        max: 75,
      },
      {
        name: 'Medium',
        average: result.stats.avgMediumWaveSize,
        max: 25,
      },
      {
        name: 'Large',
        average: result.stats.avgLargeWaveSize,
        max: 5,
      },
    ].filter(item => item.average > 0);
  }, [result]);

  // Prepare wave table data (first 20 waves)
  const waveTableData = useMemo(() => {
    if (!result) return [];
    return result.waves.slice(0, 20).map(wave => {
      const totalSize = wave.repos.reduce((sum, repo) => sum + repo.sizeMB, 0);
      const totalMetadata = wave.repos.reduce((sum, repo) => sum + repo.metadataRecords, 0);
      return {
        wave: `Wave ${wave.waveNum}`,
        org: wave.org,
        type: wave.type.charAt(0).toUpperCase() + wave.type.slice(1),
        repos: wave.repos.length,
        sizeMB: totalSize.toFixed(0),
        metadata: totalMetadata,
      };
    });
  }, [result]);

  // Organization summary data
  const orgSummaryData = useMemo(() => {
    if (!result) return [];
    const orgMap = new Map<string, { waves: number; repos: number }>();

    result.waves.forEach(wave => {
      const existing = orgMap.get(wave.org) || { waves: 0, repos: 0 };
      existing.waves++;
      existing.repos += wave.repos.length;
      orgMap.set(wave.org, existing);
    });

    return Array.from(orgMap.entries())
      .map(([org, data]) => ({
        name: org,
        waves: data.waves,
        repos: data.repos,
      }))
      .sort((a, b) => b.repos - a.repos)
      .slice(0, 10);
  }, [result]);

  // Group waves by organization for detailed view
  const wavesByOrg = useMemo(() => {
    if (!result) return new Map<string, MigrationWave[]>();
    const orgMap = new Map<string, MigrationWave[]>();

    result.waves.forEach(wave => {
      const existing = orgMap.get(wave.org) || [];
      existing.push(wave);
      orgMap.set(wave.org, existing);
    });

    return orgMap;
  }, [result]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={titleStyle}>Migration Wave Planner</h3>
        <p style={subtitleStyle}>
          Configure classification thresholds and generate your migration plan
        </p>
      </div>

      {/* Threshold Controls */}
      <div style={{ ...cardStyle, padding: '24px', marginBottom: '24px' }}>
        <h4 style={{ ...titleStyle, marginBottom: '16px' }}>Classification Thresholds</h4>
        
        <div style={inputGroupStyle}>
          <ThresholdInput
            label="Small Size Threshold (MB)"
            value={thresholds.smallSizeMB}
            onChange={(value) => setThresholds({ ...thresholds, smallSizeMB: value })}
            error={thresholds.smallSizeMB >= thresholds.largeSizeMB}
          />
          <ThresholdInput
            label="Large Size Threshold (MB)"
            value={thresholds.largeSizeMB}
            onChange={(value) => setThresholds({ ...thresholds, largeSizeMB: value })}
            error={thresholds.smallSizeMB >= thresholds.largeSizeMB}
          />
        </div>

        <div style={inputGroupStyle}>
          <ThresholdInput
            label="Small Metadata Threshold"
            value={thresholds.smallMetadata}
            onChange={(value) => setThresholds({ ...thresholds, smallMetadata: value })}
            error={thresholds.smallMetadata >= thresholds.largeMetadata}
          />
          <ThresholdInput
            label="Large Metadata Threshold"
            value={thresholds.largeMetadata}
            onChange={(value) => setThresholds({ ...thresholds, largeMetadata: value })}
            error={thresholds.smallMetadata >= thresholds.largeMetadata}
          />
        </div>

        {hasError && (
          <div style={{ color: '#f85149', fontSize: 14, marginTop: '8px' }}>
            ⚠️ Small thresholds must be less than large thresholds
          </div>
        )}

        <div style={{ marginTop: '16px', fontSize: 13, color: '#8b949e' }}>
          <strong>Wave Sizing:</strong> Small repos (75/wave), Medium repos (25/wave), Large repos (5/wave)
          <br />
          <strong>Classification:</strong> Small: &lt;{thresholds.smallSizeMB}MB AND &lt;{thresholds.smallMetadata.toLocaleString()} metadata | 
          Large: ≥{thresholds.largeSizeMB}MB OR ≥{thresholds.largeMetadata.toLocaleString()} metadata | 
          Medium: Everything else
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <div style={{ ...cardStyle, padding: '24px', marginBottom: '24px', backgroundColor: '#1c1f24' }}>
          <p style={{ color: '#f85149', margin: 0 }}>
            Please adjust thresholds to valid values to generate migration waves.
          </p>
        </div>
      )}

      {/* Results */}
      {result && !hasError && (
        <>
          {/* Summary Stats */}
          <div style={gridStyle}>
            <StatCard
              title="Total Repositories"
              value={result.stats.totalRepos.toLocaleString()}
              color="#58a6ff"
            />
            <StatCard
              title="Total Waves"
              value={result.stats.totalWaves.toLocaleString()}
              color="#3fb950"
            />
            <StatCard
              title="Small Repositories"
              value={result.stats.smallRepos.toLocaleString()}
              color="#3fb950"
            />
            <StatCard
              title="Medium Repositories"
              value={result.stats.mediumRepos.toLocaleString()}
              color="#58a6ff"
            />
            <StatCard
              title="Large Repositories"
              value={result.stats.largeRepos.toLocaleString()}
              color="#f78166"
            />
            <StatCard
              title="Small Waves"
              value={result.stats.smallWaves.toLocaleString()}
              color="#3fb950"
            />
            <StatCard
              title="Medium Waves"
              value={result.stats.mediumWaves.toLocaleString()}
              color="#58a6ff"
            />
            <StatCard
              title="Large Waves"
              value={result.stats.largeWaves.toLocaleString()}
              color="#f78166"
            />
          </div>

          {/* Charts */}
          <div style={dashboardGridStyle}>
            {/* Size Distribution Pie Chart */}
            <GenericPieChart
              title="Repository Size Distribution"
              data={sizeDistributionData}
              dataKey="value"
              formatter={(value: ValueType) => formatNumber(Number(value))}
            />

            {/* Wave Type Distribution Pie Chart */}
            <GenericPieChart
              title="Wave Type Distribution"
              data={waveTypeDistributionData}
              dataKey="value"
              formatter={(value: ValueType) => formatNumber(Number(value))}
            />

            {/* Repos per Wave Bar Chart */}
            <GenericBarChart
              title="Average Repositories per Wave"
              data={reposPerWaveData}
              bars={[
                { dataKey: 'average', name: 'Average', fill: CHART_COLORS.BLUE },
                { dataKey: 'max', name: 'Max Capacity', fill: CHART_COLORS.GRAY },
              ]}
              XAxisProps={{
                dataKey: 'name',
                stroke: '#8b949e',
              }}
              formatter={(value: ValueType) => Number(value).toFixed(1)}
            />

            {/* Organization Summary Bar Chart */}
            <GenericBarChart
              title="Top 10 Organizations by Repository Count"
              data={orgSummaryData}
              bars={[
                { dataKey: 'repos', name: 'Repositories', fill: CHART_COLORS.PURPLE },
                { dataKey: 'waves', name: 'Waves', fill: CHART_COLORS.GREEN },
              ]}
              layout="vertical"
              height={400}
              YAxisProps={{
                type: 'category',
                dataKey: 'name',
                width: 150,
                stroke: '#8b949e',
              }}
              XAxisProps={{
                type: 'number',
                stroke: '#8b949e',
              }}
              formatter={(value: ValueType) => formatNumber(Number(value))}
            />
          </div>

          {/* Wave Details Table - Quick Overview */}
          <GenericTable
            title={`Migration Waves Overview (Showing ${Math.min(20, result.waves.length)} of ${result.waves.length})`}
            data={waveTableData}
            columns={[
              { key: 'wave', header: 'Wave' },
              { key: 'org', header: 'Organization' },
              { key: 'type', header: 'Type' },
              { key: 'repos', header: 'Repos', align: 'right' },
              { key: 'sizeMB', header: 'Total Size (MB)', align: 'right' },
              { key: 'metadata', header: 'Total Metadata', align: 'right' },
            ]}
            fullWidth
          />

          {/* Detailed Wave Breakdown by Organization */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ ...titleStyle, marginBottom: '16px' }}>Detailed Wave Breakdown</h3>
            <p style={{ ...subtitleStyle, marginBottom: '24px' }}>
              Expand each wave to view the complete list of repositories
            </p>

            {Array.from(wavesByOrg.entries())
              .sort((a, b) => {
                // Sort MIXED_SMALL_ORGS first, then by total repo count
                if (a[0] === 'MIXED_SMALL_ORGS') return -1;
                if (b[0] === 'MIXED_SMALL_ORGS') return 1;
                const aRepos = a[1].reduce((sum, w) => sum + w.repos.length, 0);
                const bRepos = b[1].reduce((sum, w) => sum + w.repos.length, 0);
                return bRepos - aRepos;
              })
              .map(([orgName, waves]) => (
                <div key={orgName} style={{ marginBottom: '32px' }}>
                  {/* Organization Summary */}
                  <OrgSummary orgName={orgName} waves={waves} />

                  {/* Individual Waves */}
                  {waves.map((wave, idx) => (
                    <WaveDetailCard key={`${orgName}-${idx}`} wave={wave} />
                  ))}
                </div>
              ))}
          </div>

          {/* Migration Principles */}
          <div style={{ ...cardStyle, padding: '24px', marginTop: '24px' }}>
            <h4 style={{ ...titleStyle, marginBottom: '16px' }}>Migration Principles</h4>
            <ul style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, margin: 0, paddingLeft: '20px' }}>
              <li><strong>Organization-first:</strong> Each organization with ≥50 repos gets dedicated waves</li>
              <li><strong>Size-optimized waves:</strong> Wave size depends on repository complexity (75/25/5)</li>
              <li><strong>Small repositories first:</strong> Process simple repos before complex ones</li>
              <li><strong>Queue-aware sizing:</strong> Smaller waves for larger repositories to manage load</li>
              <li><strong>Mixed small orgs:</strong> Organizations with &lt;50 repos are batched together efficiently</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
