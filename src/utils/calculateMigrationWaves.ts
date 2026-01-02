/**
 * calculateMigrationWaves.ts
 *
 * Utility functions for calculating migration waves based on repository size and metadata complexity.
 * Implements the migration wave generation logic ported from Python.
 */

import type {
  Repository,
  ClassificationThresholds,
  SizeCategory,
  MigrationRepository,
  MigrationWave,
  WaveStats,
  MigrationWaveResult,
} from '../types';

/**
 * Wave size configuration: number of repositories per wave by size category.
 * These values balance queue management and processing efficiency.
 */
export const WAVE_SIZE_SMALL = 75;  // Small repos can be processed in larger batches
export const WAVE_SIZE_MEDIUM = 25; // Medium repos require moderate batch sizes
export const WAVE_SIZE_LARGE = 5;   // Large repos need careful, smaller batches

/**
 * Organization threshold for dedicated waves.
 * Organizations with >= this many repos get dedicated waves instead of being mixed.
 */
export const ORG_DEDICATED_WAVES_THRESHOLD = 50;

/**
 * Wave configuration options.
 */
export interface WaveConfig {
  waveSizeSmall?: number;
  waveSizeMedium?: number;
  waveSizeLarge?: number;
  orgThreshold?: number;
}

/**
 * Field mapping documentation for metadata record calculation.
 * 
 * - issues
 * - pullRequests
 * - commitComments
 * - milestones
 * - releases
 * - tags
 * - discussions
 * - issueEvents
 * 
 */

/**
 * Calculate total metadata records for a repository.
 * Aggregates all PR, issue, comment, release, and discussion counts.
 * 
 * @param repo - Repository object with metadata counts
 * @returns Total number of metadata records
 */
export function calculateMetadataRecords(repo: Repository): number {
  const counts = [
    repo.PR_Review_Count || 0,
    repo.Issue_Count || 0,
    repo.Pull_Request_Count || 0,
    repo.PR_Review_Comment_Count || 0,
    repo.Commit_Comment_Count || 0,
    repo.Issue_Comment_Count || 0,
    repo.Issue_Event_Count || 0,
    repo.Release_Count || 0,
    repo.Milestone_Count || 0,
    repo.Tag_Count || 0,
    repo.Discussion_Count || 0,
  ];

  return counts.reduce((sum, count) => sum + count, 0);
}

/**
 * Classify repository as small, medium, or large based on size and metadata.
 * 
 * Classification rules:
 * - Small: Size < smallSizeMB AND Metadata < smallMetadata
 * - Large: Size >= largeSizeMB OR Metadata >= largeMetadata
 * - Medium: Everything else
 * 
 * @param sizeMB - Repository size in megabytes
 * @param metadataRecords - Total metadata record count
 * @param thresholds - Classification threshold values
 * @returns Size category classification
 */
export function classifyRepositorySize(
  sizeMB: number,
  metadataRecords: number,
  thresholds: ClassificationThresholds
): SizeCategory {
  // Validate thresholds (small should be less than large)
  if (thresholds.smallSizeMB >= thresholds.largeSizeMB) {
    throw new Error('Small size threshold must be less than large size threshold');
  }
  if (thresholds.smallMetadata >= thresholds.largeMetadata) {
    throw new Error('Small metadata threshold must be less than large metadata threshold');
  }

  if (sizeMB < thresholds.smallSizeMB && metadataRecords < thresholds.smallMetadata) {
    return 'small';
  } else if (sizeMB >= thresholds.largeSizeMB || metadataRecords >= thresholds.largeMetadata) {
    return 'large';
  } else {
    return 'medium';
  }
}

/**
 * Get optimal wave size based on repository size category.
 * Uses exported constants for consistency across the application.
 * 
 * @param category - Size category of repositories
 * @param config - Optional wave configuration overrides
 * @returns Optimal number of repositories per wave
 */
function getWaveSizeForCategory(category: SizeCategory, config?: WaveConfig): number {
  switch (category) {
    case 'small':
      return config?.waveSizeSmall ?? WAVE_SIZE_SMALL;
    case 'medium':
      return config?.waveSizeMedium ?? WAVE_SIZE_MEDIUM;
    case 'large':
      return config?.waveSizeLarge ?? WAVE_SIZE_LARGE;
  }
}

/**
 * Create migration waves for a specific organization.
 * Groups repositories by size category and creates appropriately-sized waves.
 * 
 * @param orgName - Organization name
 * @param repos - Array of migration repositories for this org
 * @param config - Optional wave configuration overrides
 * @returns Array of migration waves
 */
function createOrgWaves(orgName: string, repos: MigrationRepository[], config?: WaveConfig): MigrationWave[] {
  const waves: MigrationWave[] = [];
  let waveNum = 1;

  // Sort repos by size (smallest first for better queue management)
  const sortedRepos = [...repos].sort((a, b) => {
    // First sort by category (small < medium < large)
    const categoryOrder = { small: 0, medium: 1, large: 2 };
    if (categoryOrder[a.sizeCategory] !== categoryOrder[b.sizeCategory]) {
      return categoryOrder[a.sizeCategory] - categoryOrder[b.sizeCategory];
    }
    // Then by size
    if (a.sizeMB !== b.sizeMB) {
      return a.sizeMB - b.sizeMB;
    }
    // Finally by metadata count
    return a.metadataRecords - b.metadataRecords;
  });

  // Group by size category
  const smallRepos = sortedRepos.filter(r => r.sizeCategory === 'small');
  const mediumRepos = sortedRepos.filter(r => r.sizeCategory === 'medium');
  const largeRepos = sortedRepos.filter(r => r.sizeCategory === 'large');

  // Process small repositories first
  if (smallRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('small', config);
    for (let i = 0; i < smallRepos.length; i += waveSize) {
      const chunk = smallRepos.slice(i, i + waveSize);
      waves.push({
        org: orgName,
        waveNum: waveNum++,
        repos: chunk,
        type: 'small',
      });
    }
  }

  // Process medium repositories
  if (mediumRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('medium', config);
    for (let i = 0; i < mediumRepos.length; i += waveSize) {
      const chunk = mediumRepos.slice(i, i + waveSize);
      waves.push({
        org: orgName,
        waveNum: waveNum++,
        repos: chunk,
        type: 'medium',
      });
    }
  }

  // Process large repositories
  if (largeRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('large', config);
    for (let i = 0; i < largeRepos.length; i += waveSize) {
      const chunk = largeRepos.slice(i, i + waveSize);
      waves.push({
        org: orgName,
        waveNum: waveNum++,
        repos: chunk,
        type: 'large',
      });
    }
  }

  return waves;
}

/**
 * Create waves for small organizations (mixed together).
 * Combines repositories from multiple small organizations into shared waves.
 * 
 * @param repos - Array of repositories from small organizations
 * @param config - Optional wave configuration overrides
 * @returns Array of migration waves
 */
function createMixedOrgWaves(repos: MigrationRepository[], config?: WaveConfig): MigrationWave[] {
  const waves: MigrationWave[] = [];
  let waveNum = 1;

  // Sort all repos by size (smallest first)
  const sortedRepos = [...repos].sort((a, b) => {
    const categoryOrder = { small: 0, medium: 1, large: 2 };
    if (categoryOrder[a.sizeCategory] !== categoryOrder[b.sizeCategory]) {
      return categoryOrder[a.sizeCategory] - categoryOrder[b.sizeCategory];
    }
    if (a.sizeMB !== b.sizeMB) {
      return a.sizeMB - b.sizeMB;
    }
    return a.metadataRecords - b.metadataRecords;
  });

  // Group by size category
  const smallRepos = sortedRepos.filter(r => r.sizeCategory === 'small');
  const mediumRepos = sortedRepos.filter(r => r.sizeCategory === 'medium');
  const largeRepos = sortedRepos.filter(r => r.sizeCategory === 'large');

  // Process small repositories
  if (smallRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('small', config);
    for (let i = 0; i < smallRepos.length; i += waveSize) {
      const chunk = smallRepos.slice(i, i + waveSize);
      waves.push({
        org: 'MIXED_SMALL_ORGS',
        waveNum: waveNum++,
        repos: chunk,
        type: 'small',
      });
    }
  }

  // Process medium repositories
  if (mediumRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('medium', config);
    for (let i = 0; i < mediumRepos.length; i += waveSize) {
      const chunk = mediumRepos.slice(i, i + waveSize);
      waves.push({
        org: 'MIXED_SMALL_ORGS',
        waveNum: waveNum++,
        repos: chunk,
        type: 'medium',
      });
    }
  }

  // Process large repositories
  if (largeRepos.length > 0) {
    const waveSize = getWaveSizeForCategory('large', config);
    for (let i = 0; i < largeRepos.length; i += waveSize) {
      const chunk = largeRepos.slice(i, i + waveSize);
      waves.push({
        org: 'MIXED_SMALL_ORGS',
        waveNum: waveNum++,
        repos: chunk,
        type: 'large',
      });
    }
  }

  return waves;
}

/**
 * Calculate wave statistics from generated waves.
 * 
 * @param waves - Array of migration waves
 * @returns Statistics summary
 */
function calculateWaveStats(waves: MigrationWave[]): WaveStats {
  const totalRepos = waves.reduce((sum, wave) => sum + wave.repos.length, 0);
  const totalWaves = waves.length;

  // Count repos by category
  let smallRepos = 0;
  let mediumRepos = 0;
  let largeRepos = 0;

  waves.forEach(wave => {
    wave.repos.forEach(repo => {
      switch (repo.sizeCategory) {
        case 'small':
          smallRepos++;
          break;
        case 'medium':
          mediumRepos++;
          break;
        case 'large':
          largeRepos++;
          break;
      }
    });
  });

  // Count waves by type
  const smallWaves = waves.filter(w => w.type === 'small').length;
  const mediumWaves = waves.filter(w => w.type === 'medium').length;
  const largeWaves = waves.filter(w => w.type === 'large').length;

  // Calculate average wave sizes
  const smallWaveRepos = waves
    .filter(w => w.type === 'small')
    .reduce((sum, wave) => sum + wave.repos.length, 0);
  const mediumWaveRepos = waves
    .filter(w => w.type === 'medium')
    .reduce((sum, wave) => sum + wave.repos.length, 0);
  const largeWaveRepos = waves
    .filter(w => w.type === 'large')
    .reduce((sum, wave) => sum + wave.repos.length, 0);

  const avgSmallWaveSize = smallWaves > 0 ? smallWaveRepos / smallWaves : 0;
  const avgMediumWaveSize = mediumWaves > 0 ? mediumWaveRepos / mediumWaves : 0;
  const avgLargeWaveSize = largeWaves > 0 ? largeWaveRepos / largeWaves : 0;

  return {
    totalRepos,
    totalWaves,
    smallRepos,
    mediumRepos,
    largeRepos,
    smallWaves,
    mediumWaves,
    largeWaves,
    avgSmallWaveSize,
    avgMediumWaveSize,
    avgLargeWaveSize,
  };
}

/**
 * Generate migration waves from repository data.
 * 
 * Strategy:
 * 1. Organizations with >= orgThreshold repos get dedicated waves
 * 2. Organizations with < orgThreshold repos are mixed together
 * 3. Repositories are sorted by size (smallest first)
 * 4. Wave sizes are optimized based on repository complexity
 * 
 * @param repositories - Array of repositories to analyze
 * @param thresholds - Classification thresholds
 * @param config - Optional wave configuration overrides
 * @returns Migration wave result with waves and statistics
 */
export function generateMigrationWaves(
  repositories: Repository[],
  thresholds: ClassificationThresholds,
  config?: WaveConfig
): MigrationWaveResult {
  // Prepare migration repositories with calculated metadata and classification
  const migrationRepos: MigrationRepository[] = repositories.map(repo => {
    const metadataRecords = calculateMetadataRecords(repo);
    const sizeCategory = classifyRepositorySize(repo.Repo_Size_MB, metadataRecords, thresholds);

    return {
      orgName: repo.Org_Name,
      repoName: repo.Repo_Name,
      sizeMB: repo.Repo_Size_MB,
      metadataRecords,
      sizeCategory,
    };
  });

  // Group by organization
  const orgGroups = new Map<string, MigrationRepository[]>();
  migrationRepos.forEach(repo => {
    const existing = orgGroups.get(repo.orgName) || [];
    existing.push(repo);
    orgGroups.set(repo.orgName, existing);
  });

  const allWaves: MigrationWave[] = [];
  const smallOrgRepos: MigrationRepository[] = [];
  const orgThreshold = config?.orgThreshold ?? ORG_DEDICATED_WAVES_THRESHOLD;

  // Process each organization
  orgGroups.forEach((repos, orgName) => {
    if (repos.length >= orgThreshold) {
      // Large org: create dedicated waves
      const waves = createOrgWaves(orgName, repos, config);
      allWaves.push(...waves);
    } else {
      // Small org: add to mixed pool
      smallOrgRepos.push(...repos);
    }
  });

  // Create waves for small organizations (process first)
  if (smallOrgRepos.length > 0) {
    const mixedWaves = createMixedOrgWaves(smallOrgRepos, config);
    // Insert at beginning so small orgs are processed first
    allWaves.unshift(...mixedWaves);
  }

  // Calculate statistics
  const stats = calculateWaveStats(allWaves);

  return {
    waves: allWaves,
    stats,
  };
}

/**
 * Default classification thresholds based on Python script.
 */
export const DEFAULT_THRESHOLDS: ClassificationThresholds = {
  smallSizeMB: 500,
  largeSizeMB: 2000,
  smallMetadata: 75000,
  largeMetadata: 200000,
};
