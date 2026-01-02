// Repository Types
/**
 * Represents a GitHub repository with its metadata and statistics.
 * @interface Repository
 */
export interface Repository {
  /** Organization name that owns the repository */
  Org_Name: string;
  /** Name of the repository */
  Repo_Name: string;
  /** Size of the repository in megabytes */
  Repo_Size_MB: number;
  /** Total number of issues in the repository */
  Issue_Count: number;
  /** Total number of pull requests */
  Pull_Request_Count: number;
  /** Total number of commit comments */
  Commit_Comment_Count: number;
  /** Total number of milestones */
  Milestone_Count: number;
  /** Total number of releases */
  Release_Count: number;
  /** Total number of tags */
  Tag_Count: number;
  /** Total number of issue comments */
  Issue_Comment_Count: number;
  /** Total number of PR review comments */
  PR_Review_Comment_Count: number;
  /** Total number of branches */
  Branch_Count: number;
  /** Timestamp of the last push to the repository */
  Last_Push: string;
  /** Timestamp when the repository was created */
  Created: string;
  /** Number of collaborators with access to the repository */
  Collaborator_Count: number;
  /** Number of protected branches */
  Protected_Branch_Count: number;
  /** Number of projects in the repository */
  Project_Count: number;
  /** Whether the repository has a wiki (1 for true, 0 for false) */
  Has_Wiki: number;
  /** Total number of discussions */
  Discussion_Count: number;
  /** Total number of PR reviews */
  PR_Review_Count: number;
  /** Total number of issue events */
  Issue_Event_Count: number;
  /** Whether the repository is empty */
  Is_Empty: boolean;
  /** Whether the repository is a fork */
  Is_Fork: boolean;
  /** Whether the repository is archived */
  Is_Archived: boolean;
  /** Timestamp of the last update to the repository */
  Last_Update: string;
  /** URL of the repository */
  Repo_URL: string;
  /** Whether there are migration issues */
  Migration_Issue: boolean;
  
  // GitHub Actions data
  /** Number of Actions workflows */
  Workflows_Count?: number;
  /** Number of Actions secrets */
  Secrets_Count?: number;
  /** Number of Actions variables */
  Variables_Count?: number;
  /** Number of Actions runners */
  Runners_Count?: number;
  /** Actions cache usage in bytes */
  Cache_Usage_Bytes?: number;
  /** Number of active caches */
  Active_Caches_Count?: number;
  
  // Security data
  /** Whether Dependabot is enabled */
  Dependabot_Enabled?: boolean;
  /** Whether secret scanning is enabled */
  Secret_Scanning_Enabled?: boolean;
  /** Whether secret scanning push protection is enabled */
  Secret_Scanning_Push_Protection?: boolean;
  
  // Language data (stored as JSON string)
  /** Primary programming language */
  Primary_Language?: string;
  /** All languages with byte counts (JSON string) */
  Languages?: string;
  
  // Issues detailed data
  /** Number of open issues */
  Open_Issues?: number;
  /** Number of closed issues */
  Closed_Issues?: number;
  /** Number of labels */
  Labels_Count?: number;
  
  // Pull requests detailed data
  /** Number of open PRs */
  Open_PRs?: number;
  /** Number of closed PRs */
  Closed_PRs?: number;
  /** Number of merged PRs */
  Merged_PRs?: number;
  
  // Traffic data
  /** Total view count */
  Views_Count?: number;
  /** Unique viewers count */
  Views_Uniques?: number;
  /** Total clone count */
  Clones_Count?: number;
  /** Unique cloners count */
  Clones_Uniques?: number;
  
  // Community & other data
  /** Community health percentage */
  Health_Percentage?: number;
  /** Whether repository has a code of conduct file */
  Has_Code_Of_Conduct?: boolean;
  /** Whether repository has a contributing file */
  Has_Contributing?: boolean;
  /** Whether repository has a license file in community profile */
  Has_License_File?: boolean;
  /** Number of git references (branches + tags) */
  Git_References_Count?: number;
  /** Whether Git LFS is enabled */
  Git_LFS_Enabled?: boolean;
  /** Number of packages */
  Packages_Count?: number;
  /** Number of package versions */
  Package_Versions_Count?: number;
  
  // Repository settings
  /** Default branch name */
  Default_Branch?: string;
  /** Repository visibility (public/private/internal) */
  Visibility?: string;
  /** Whether issues feature is enabled */
  Issues_Enabled?: boolean;
  /** Whether projects feature is enabled */
  Projects_Enabled?: boolean;
  /** Whether discussions feature is enabled */
  Discussions_Enabled?: boolean;
  /** Whether squash merge is allowed */
  Allow_Squash_Merge?: boolean;
  /** Whether merge commit is allowed */
  Allow_Merge_Commit?: boolean;
  /** Whether rebase merge is allowed */
  Allow_Rebase_Merge?: boolean;
  /** Whether auto merge is allowed */
  Allow_Auto_Merge?: boolean;
  /** Whether to delete branch on merge */
  Delete_Branch_On_Merge?: boolean;
  /** Whether forking is allowed */
  Allow_Forking?: boolean;
  /** Whether web commit signoff is required */
  Web_Commit_Signoff_Required?: boolean;
  
  // Collaborator details (stored as JSON)
  /** Detailed collaborator permissions (JSON string) */
  Collaborators_Detailed?: string;
  
  // Repository files
  /** Whether README exists */
  Has_Readme?: boolean;
  /** README file size in bytes */
  Readme_Size?: number;
  
  // License & topics
  /** License key (e.g., 'mit', 'apache-2.0') */
  License_Key?: string;
  /** License name */
  License_Name?: string;
  /** License SPDX ID */
  License_SPDX_ID?: string;
  /** Repository topics (stored as JSON array string) */
  Topics?: string;
  /** Number of topics */
  Topics_Count?: number;
  
  // Deployments & environments
  /** Number of deployments */
  Deployments_Count?: number;
  /** Deployment details (stored as JSON string) */
  Deployments?: string;
  /** Number of environments */
  Environments_Count?: number;
  /** Environment details (stored as JSON string) */
  Environments?: string;
  
  // Webhooks & team access
  /** Number of webhooks */
  Webhooks_Count?: number;
  /** Webhook details (stored as JSON string) */
  Webhooks?: string;
  /** Team access details (stored as JSON string) */
  Team_Access?: string;
  /** Number of teams with access */
  Team_Access_Count?: number;
  
  // Rulesets
  /** Number of rulesets */
  Rulesets_Count?: number;
  /** Ruleset details (stored as JSON string) */
  Rulesets?: string;
}

// Repository Analysis Types
/**
 * Represents the age information of a repository.
 * @interface RepositoryAge
 */
export interface RepositoryAge {
  /** Name of the repository */
  name: string;
  /** Age of the repository in days */
  ageInDays: number;
  /** Age of the repository in years */
  ageInYears: number;
}

/**
 * Represents the complexity metrics of a repository.
 * @interface RepositoryComplexity
 */
export interface RepositoryComplexity {
  /** Name of the repository */
  name: string;
  /** Number of branches */
  branches: number;
  /** Size of the repository */
  size: number;
  /** Age of the repository as a string */
  age: string;
  /** Complexity score based on repository size */
  complexityBySize: number;
  /** Complexity score based on repository age */
  complexityByAge: number;
}

/**
 * Represents the activity metrics of a repository.
 * @interface RepositoryActivity
 */
export interface RepositoryActivity {
  /** Name of the repository */
  name: string;
  /** Number of issues */
  issues: number;
  /** Number of pull requests */
  prs: number;
  /** Total activity (issues + PRs) */
  total: number;
}

/**
 * Represents metadata and ratio information for a repository.
 * @interface RepositoryMetadata
 */
export interface RepositoryMetadata {
  /** Name of the repository */
  name: string;
  /** Size of the repository */
  size: number;
  /** Amount of metadata */
  metadata: number;
  /** Ratio of metadata to size */
  ratio: number;
}

/**
 * Represents release and tag information for a repository.
 * @interface RepositoryReleaseInfo
 */
export interface RepositoryReleaseInfo {
  /** Name of the repository */
  name: string;
  /** Number of tags */
  tags: number;
  /** Number of releases */
  releases: number;
  /** Age of the repository as a string */
  age: string;
  /** Average number of tags per year */
  tagsPerYear: number;
  /** Average number of releases per year */
  releasesPerYear: number;
  /** Total number of releases and tags */
  total: number;
}

// Stats Types
/**
 * Represents basic statistics for a collection of repositories.
 * @interface BasicStats
 */
export interface BasicStats {
  /** Total number of repositories */
  totalRepos: number;
  /** Total size of all repositories in MB */
  totalSize: number;
  /** Total number of issues across all repositories */
  totalIssues: number;
  /** Total number of pull requests */
  totalPRs: number;
  /** Total number of commit comments */
  totalCommitComments: number;
  /** Total number of milestones */
  totalMilestones: number;
  /** Total number of releases */
  totalReleases: number;
  /** Total number of collaborators */
  totalCollaborators: number;
  /** Total number of protected branches */
  totalProtectedBranches: number;
  /** Total number of projects */
  totalProjects: number;
  /** Total number of tags */
  totalTags: number;
  /** Total number of issue comments */
  totalIssueComments: number;
  /** Total number of PR review comments */
  totalPRReviewComments: number;
  /** Total number of branches */
  totalBranches: number;
  /** Total number of discussions */
  totalDiscussions: number;
  /** Total number of PR reviews */
  totalPRReviews: number;
  /** Total number of issue events */
  totalIssueEvents: number;
  /** Total number of wikis */
  totalWikis: number;
  /** Total number of forks */
  totalForks: number;
  /** Total number of archived repositories */
  totalArchived: number;
  /** Total number of empty repositories */
  totalEmpty: number;
}

/**
 * Represents a single data point for charts and visualizations.
 * @interface DataPoint
 */
export interface DataPoint {
  /** Name or label of the data point */
  name: string;
  /** Numeric value of the data point */
  value: number;
}

/**
 * Represents yearly data for time-based analysis.
 * @interface YearData
 */
export interface YearData {
  /** Year of the data point */
  year: number;
  /** Count or value for that year */
  count: number;
}

/**
 * Represents collaboration statistics for repositories.
 * @interface CollaborationStats
 */
export interface CollaborationStats {
  /** Distribution of repositories by collaborator count ranges */
  collaboratorDistribution: { range: string; count: number }[];
  /** Top repositories by number of collaborators */
  topCollaboratorRepos: { name: string; collaboratorCount: number }[];
  /** Distribution of repository features */
  featureDistribution: { feature: string; count: number; total: number }[];
}

/**
 * Represents organization-level metadata and statistics.
 * @interface OrgStats
 */
export interface OrgStats {
  /** Organization login name */
  login: string;
  /** Organization ID */
  id?: number;
  /** Organization node ID */
  nodeId?: string;
  /** Organization display name */
  name?: string;
  /** Organization description */
  description?: string;
  /** Organization blog URL */
  blog?: string;
  /** Organization location */
  location?: string;
  /** Organization email */
  email?: string;
  /** Organization API URL */
  url?: string;
  /** Total number of public repositories */
  publicRepos: number;
  /** Total number of private repositories */
  totalPrivateRepos: number;
  /** Number of private repos owned by the org */
  ownedPrivateRepos?: number;
  /** Number of public gists */
  publicGists?: number;
  /** Number of followers */
  followers?: number;
  /** Number following */
  following?: number;
  /** Number of organization members */
  membersCount: number;
  /** Number of outside collaborators */
  outsideCollaboratorsCount: number;
  /** Number of teams */
  teamsCount: number;
  /** Number of self-hosted runners */
  runnersCount: number;
  /** Number of organization roles */
  organizationRolesCount?: number;
  /** Organization created date */
  createdAt: string;
  /** Organization last updated date */
  updatedAt?: string;
  /** Default repository permission */
  defaultRepoPermission?: string;
  /** Whether members can create repositories */
  membersCanCreateRepos?: boolean;
  /** Whether members can create public repositories */
  membersCanCreatePublicRepos?: boolean;
  /** Whether members can create private repositories */
  membersCanCreatePrivateRepos?: boolean;
  /** Whether members can fork private repositories */
  membersCanForkPrivateRepos?: boolean;
  /** Number of Actions secrets */
  actionsSecretsCount?: number;
  /** Number of Actions variables */
  actionsVariablesCount?: number;
}

/**
 * Represents comprehensive statistics and analysis data for a collection of repositories.
 * @interface Stats
 */
export interface Stats {
  /** Organization-level statistics (if available) */
  orgs?: OrgStats[];
  /** Raw repository data for filtering */
  repositories: Repository[];
  /** Basic statistics about the repositories */
  basic: BasicStats;
  /** Security feature adoption data */
  securityData: Array<{ name: string; enabled: number; disabled: number }>;
  /** Language distribution data */
  languageData: Array<{ name: string; value: number }>;
  /** Traffic statistics for top repositories */
  trafficData: Array<{ name: string; views: number; clones: number; viewsUniques: number; clonesUniques: number }>;
  /** Most common repository topics */
  topicsData: Array<{ name: string; value: number }>;
  /** License distribution data */
  licenseData: Array<{ name: string; value: number }>;
  /** Repository settings/feature enablement */
  settingsData: Array<{ feature: string; enabled: number; disabled: number }>;
  /** GitHub Actions usage by repository */
  actionsData: Array<{ name: string; workflows: number; secrets: number; variables: number; runners: number }>;
  /** Aggregate issues/PRs stats */
  issuesPRsData: { openIssues: number; closedIssues: number; openPRs: number; closedPRs: number; mergedPRs: number; totalLabels: number };
  /** Community health scores */
  communityHealthData: Array<{ name: string; health: number }>;
  /** Community features adoption */
  communityFeaturesData: { reposWithReadme: number; reposWithCodeOfConduct: number; reposWithContributing: number; reposWithLicenseFile: number; reposWithLFS: number; reposWithPackages: number; totalDeployments: number; totalEnvironments: number; totalWebhooks: number; activeWebhooks: number; totalRulesets: number; total: number };
  /** Data points for activity analysis */
  activityData: DataPoint[];
  /** Data points for size analysis */
  sizeData: DataPoint[];
  /** Data points for update frequency analysis */
  updateData: DataPoint[];
  /** Data points for organization analysis */
  orgData: DataPoint[];
  /** Yearly data for time-based analysis */
  yearData: YearData[];
  /** Data points for branch analysis */
  branchData: DataPoint[];
  /** Data points for largest repositories */
  largestRepos: DataPoint[];
  /** Most active repositories by issues and PRs */
  mostActiveRepos: RepositoryActivity[];
  /** Newest repositories with creation dates */
  newestRepos: { name: string; created: string }[];
  /** Oldest repositories with creation dates */
  oldestRepos: { name: string; created: string }[];
  /** Recently updated repositories with last push dates */
  recentlyUpdated: { name: string; lastPush: string }[];
  /** Repository metadata ratios */
  metadataRatios: RepositoryMetadata[];
  /** Repository complexity metrics */
  branchComplexity: RepositoryComplexity[];
  /** Tag and release frequency analysis */
  tagReleaseFrequency: RepositoryReleaseInfo[];
  /** Repository age analysis */
  repositoryAge: RepositoryAge[];
  /** Collaboration statistics */
  collaborationStats: CollaborationStats;
}

// Legacy type for backward compatibility
/**
 * Legacy type alias for backward compatibility.
 * @type {Repository}
 */
export type RepoData = Repository;

// Migration Wave Analyzer Types
/**
 * Classification thresholds for categorizing repository sizes.
 * @interface ClassificationThresholds
 */
export interface ClassificationThresholds {
  /** Size threshold in MB for small repositories */
  smallSizeMB: number;
  /** Size threshold in MB for large repositories */
  largeSizeMB: number;
  /** Metadata record count threshold for small repositories */
  smallMetadata: number;
  /** Metadata record count threshold for large repositories */
  largeMetadata: number;
}

/**
 * Repository size category classification.
 */
export type SizeCategory = 'small' | 'medium' | 'large';

/**
 * Represents a single repository with migration-relevant data.
 * @interface MigrationRepository
 */
export interface MigrationRepository {
  /** Organization name */
  orgName: string;
  /** Repository name */
  repoName: string;
  /** Repository size in MB */
  sizeMB: number;
  /** Total metadata records count */
  metadataRecords: number;
  /** Size category classification */
  sizeCategory: SizeCategory;
}

/**
 * Represents a migration wave containing repositories.
 * @interface MigrationWave
 */
export interface MigrationWave {
  /** Organization name (or 'MIXED_SMALL_ORGS') */
  org: string;
  /** Wave number within the organization */
  waveNum: number;
  /** Repositories in this wave */
  repos: MigrationRepository[];
  /** Type/category of wave based on repo sizes */
  type: SizeCategory;
}

/**
 * Statistics summary for migration waves.
 * @interface WaveStats
 */
export interface WaveStats {
  /** Total number of repositories */
  totalRepos: number;
  /** Total number of waves */
  totalWaves: number;
  /** Number of small repositories */
  smallRepos: number;
  /** Number of medium repositories */
  mediumRepos: number;
  /** Number of large repositories */
  largeRepos: number;
  /** Number of waves with small repos */
  smallWaves: number;
  /** Number of waves with medium repos */
  mediumWaves: number;
  /** Number of waves with large repos */
  largeWaves: number;
  /** Average wave size for small repo waves */
  avgSmallWaveSize: number;
  /** Average wave size for medium repo waves */
  avgMediumWaveSize: number;
  /** Average wave size for large repo waves */
  avgLargeWaveSize: number;
}

/**
 * Result of migration wave calculation.
 * @interface MigrationWaveResult
 */
export interface MigrationWaveResult {
  /** All generated migration waves */
  waves: MigrationWave[];
  /** Statistics summary */
  stats: WaveStats;
}
