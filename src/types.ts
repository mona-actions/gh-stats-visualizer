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
 * Represents comprehensive statistics and analysis data for a collection of repositories.
 * @interface Stats
 */
export interface Stats {
  /** Basic statistics about the repositories */
  basic: BasicStats;
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
