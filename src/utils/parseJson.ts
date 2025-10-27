/**
 * parseJson.ts
 *
 * Provides a function to parse JSON from gh-github-stats and convert it to the Repository format
 * expected by the visualizer.
 */

import type { Repository, OrgStats } from "../types";

/**
 * Interface matching the gh-github-stats org format
 */
interface GhGithubStatsOrg {
  login: string;
  id?: number;
  nodeId?: string;
  name?: string;
  description?: string;
  blog?: string;
  location?: string;
  email?: string;
  url?: string;
  publicRepos: number;
  totalPrivateRepos: number;
  ownedPrivateRepos?: number;
  publicGists?: number;
  followers?: number;
  following?: number;
  membersCount: number;
  outsideCollaboratorsCount: number;
  teamsCount: number;
  runnersCount: number;
  organizationRolesCount?: number;
  createdAt: string;
  updatedAt?: string;
  defaultRepoPermission?: string;
  membersCanCreateRepos?: boolean;
  membersCanCreatePublicRepos?: boolean;
  membersCanCreatePrivateRepos?: boolean;
  membersCanForkPrivateRepos?: boolean;
  actionsSecrets?: any[];
  actionsVariables?: any[];
}

/**
 * Interface matching the gh-github-stats JSON output format
 */
interface GhGithubStatsRepo {
  org: string;
  name?: string;
  repo?: string; // Some might have 'repo' instead of 'name'
  url: string;
  isFork: boolean;
  isArchived: boolean;
  diskUsage?: number; // In KB, we'll convert to MB
  sizeMB?: number; // Fallback if already in MB
  hasWikiEnabled?: boolean;
  hasWiki?: boolean; // Fallback
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  collaborators: number;
  branches: number;
  tags: number;
  branchProtections?: number;
  protectedBranches?: number; // Fallback
  issues: number;
  pullRequests: number;
  milestones: number;
  releases: number;
  projects: number;
  discussions: number;
  commitComments: number;
  issueEvents: number;
  packages?: number;
  packageVersions?: number;
  
  // GitHub Actions data
  actions?: {
    workflowsCount?: number;
    secretsCount?: number;
    variablesCount?: number;
    runnersCount?: number;
    cacheUsage?: {
      activeCachesSizeInBytes?: number;
      activeCachesCount?: number;
    };
  };
  
  // Security data
  security?: {
    dependabot?: {
      enabled?: boolean;
    };
    secretScanning?: {
      enabled?: boolean;
      pushProtectionEnabled?: boolean;
    };
  };
  
  // Language data
  languages?: Record<string, number>;
  
  // Issues detailed data
  issuesData?: {
    openCount?: number;
    closedCount?: number;
    totalCount?: number;
    labelsCount?: number;
    milestonesCount?: number;
  };
  
  // Pull requests detailed data
  pullRequestsData?: {
    openCount?: number;
    closedCount?: number;
    mergedCount?: number;
    totalCount?: number;
  };
  
  // Traffic data
  traffic?: {
    views?: {
      count?: number;
      uniques?: number;
    };
    clones?: {
      count?: number;
      uniques?: number;
    };
  };
  
  // Community profile
  communityProfile?: {
    healthPercentage?: number;
    files?: {
      readme?: {
        url?: string;
        htmlUrl?: string;
      };
      codeOfConduct?: {
        url?: string;
        htmlUrl?: string;
      };
      contributing?: {
        url?: string;
        htmlUrl?: string;
      };
      license?: {
        url?: string;
        htmlUrl?: string;
      };
    };
  };
  
  // Other data
  gitReferencesCount?: number;
  gitLFSEnabled?: boolean;
  
  // Repository settings
  settings?: {
    defaultBranch?: string;
    visibility?: string;
    hasIssues?: boolean;
    hasProjects?: boolean;
    hasWiki?: boolean;
    hasDiscussions?: boolean;
    allowSquashMerge?: boolean;
    allowMergeCommit?: boolean;
    allowRebaseMerge?: boolean;
    allowAutoMerge?: boolean;
    deleteBranchOnMerge?: boolean;
    allowForking?: boolean;
    webCommitSignoffRequired?: boolean;
  };
  
  // Collaborators detailed
  collaboratorsDetailed?: Array<{
    login?: string;
    id?: number;
    permissions?: {
      admin?: boolean;
      maintain?: boolean;
      push?: boolean;
      triage?: boolean;
      pull?: boolean;
    };
    roleName?: string;
  }>;
  
  // Repository files
  repoFiles?: {
    readme?: {
      name?: string;
      size?: number;
      [key: string]: any;
    };
  };
  
  // License & topics
  license?: {
    key?: string;
    name?: string;
    spdxId?: string;
    [key: string]: any;
  };
  topics?: string[];
  
  // Deployments & environments
  deployments?: Array<{
    id?: number;
    sha?: string;
    ref?: string;
    [key: string]: any;
  }>;
  environments?: Array<{
    id?: number;
    name?: string;
    url?: string;
    [key: string]: any;
  }>;
  
  // Webhooks & team access
  webhooks?: Array<{
    id?: number;
    name?: string;
    active?: boolean;
    events?: string[];
    [key: string]: any;
  }>;
  teamAccess?: Array<{
    teamId?: number;
    teamName?: string;
    teamSlug?: string;
    permission?: string;
    [key: string]: any;
  }>;
  
  // Rulesets
  rulesets?: Array<{
    id?: number;
    name?: string;
    target?: string;
    enforcement?: string;
    [key: string]: any;
  }>;
}

interface GhGithubStatsFormat {
  orgs?: GhGithubStatsOrg[];
  repos: GhGithubStatsRepo[];
  packages?: any[];
}

/**
 * Converts gh-github-stats org format to OrgStats.
 *
 * @param orgs - Array of org data from gh-github-stats
 * @returns Array of OrgStats objects
 */
export function parseOrgData(orgs: GhGithubStatsOrg[]): OrgStats[] {
  if (!orgs || !Array.isArray(orgs)) {
    return [];
  }

  return orgs.map((org) => ({
    login: org.login,
    id: org.id,
    nodeId: org.nodeId,
    name: org.name,
    description: org.description,
    blog: org.blog,
    location: org.location,
    email: org.email,
    url: org.url,
    publicRepos: org.publicRepos || 0,
    totalPrivateRepos: org.totalPrivateRepos || 0,
    ownedPrivateRepos: org.ownedPrivateRepos,
    publicGists: org.publicGists,
    followers: org.followers,
    following: org.following,
    membersCount: org.membersCount || 0,
    outsideCollaboratorsCount: org.outsideCollaboratorsCount || 0,
    teamsCount: org.teamsCount || 0,
    runnersCount: org.runnersCount || 0,
    organizationRolesCount: org.organizationRolesCount,
    createdAt: org.createdAt || '',
    updatedAt: org.updatedAt,
    defaultRepoPermission: org.defaultRepoPermission,
    membersCanCreateRepos: org.membersCanCreateRepos,
    membersCanCreatePublicRepos: org.membersCanCreatePublicRepos,
    membersCanCreatePrivateRepos: org.membersCanCreatePrivateRepos,
    membersCanForkPrivateRepos: org.membersCanForkPrivateRepos,
    actionsSecretsCount: org.actionsSecrets?.length || 0,
    actionsVariablesCount: org.actionsVariables?.length || 0,
  }));
}

/**
 * Converts gh-github-stats JSON format to the Repository format expected by the visualizer.
 *
 * @param jsonData - The parsed JSON data from gh-github-stats
 * @returns Object with repos array and optional orgs array
 */
export function parseGhGithubStatsJson(jsonData: GhGithubStatsFormat | GhGithubStatsRepo[]): { repos: Repository[]; orgs?: OrgStats[] } {
  // Handle both old format (array) and new format (object with repos array)
  const isArray = Array.isArray(jsonData);
  const repos = isArray ? jsonData : jsonData.repos;
  const orgs = !isArray && jsonData.orgs ? parseOrgData(jsonData.orgs) : undefined;

  if (!repos || !Array.isArray(repos)) {
    throw new Error('Invalid JSON format: expected an array of repositories or an object with a "repos" array');
  }

  const repositories = repos.map((repo: GhGithubStatsRepo) => {
    // Convert disk usage from KB to MB
    const sizeInMB = repo.sizeMB !== undefined 
      ? repo.sizeMB 
      : repo.diskUsage !== undefined 
        ? repo.diskUsage / 1024 
        : 0;
    
    // Extract primary language (the one with most bytes)
    let primaryLanguage: string | undefined;
    let languagesJson: string | undefined;
    if (repo.languages) {
      const entries = Object.entries(repo.languages);
      if (entries.length > 0) {
        primaryLanguage = entries.sort((a, b) => b[1] - a[1])[0][0];
        languagesJson = JSON.stringify(repo.languages);
      }
    }

    return {
      Org_Name: repo.org,
      Repo_Name: repo.name || repo.repo || 'unknown',
      Repo_Size_MB: Math.round(sizeInMB * 100) / 100, // Round to 2 decimal places
      Issue_Count: repo.issues || 0,
      Pull_Request_Count: repo.pullRequests || 0,
      Commit_Comment_Count: repo.commitComments || 0,
      Milestone_Count: repo.milestones || 0,
      Release_Count: repo.releases || 0,
      Tag_Count: repo.tags || 0,
      Issue_Comment_Count: 0, // Not collected by gh-github-stats
      PR_Review_Comment_Count: 0, // Not collected by gh-github-stats
      Branch_Count: repo.branches || 0,
      Last_Push: repo.pushedAt || '',
      Created: repo.createdAt || '',
      Collaborator_Count: repo.collaborators || 0,
      Protected_Branch_Count: repo.branchProtections !== undefined 
        ? repo.branchProtections 
        : repo.protectedBranches || 0,
      Project_Count: repo.projects || 0,
      Has_Wiki: (repo.hasWikiEnabled !== undefined ? repo.hasWikiEnabled : repo.hasWiki) ? 1 : 0,
      Discussion_Count: repo.discussions || 0,
      PR_Review_Count: 0, // Not collected by gh-github-stats
      Issue_Event_Count: repo.issueEvents || 0,
      Is_Empty: false, // Not tracked by gh-github-stats
      Is_Fork: repo.isFork || false,
      Is_Archived: repo.isArchived || false,
      Last_Update: repo.updatedAt || '',
      Repo_URL: repo.url || '',
      Migration_Issue: false, // Not relevant for gh-github-stats
      
      // GitHub Actions data
      Workflows_Count: repo.actions?.workflowsCount,
      Secrets_Count: repo.actions?.secretsCount,
      Variables_Count: repo.actions?.variablesCount,
      Runners_Count: repo.actions?.runnersCount,
      Cache_Usage_Bytes: repo.actions?.cacheUsage?.activeCachesSizeInBytes,
      Active_Caches_Count: repo.actions?.cacheUsage?.activeCachesCount,
      
      // Security data
      Dependabot_Enabled: repo.security?.dependabot?.enabled,
      Secret_Scanning_Enabled: repo.security?.secretScanning?.enabled,
      Secret_Scanning_Push_Protection: repo.security?.secretScanning?.pushProtectionEnabled,
      
      // Language data
      Primary_Language: primaryLanguage,
      Languages: languagesJson,
      
      // Issues detailed data
      Open_Issues: repo.issuesData?.openCount,
      Closed_Issues: repo.issuesData?.closedCount,
      Labels_Count: repo.issuesData?.labelsCount,
      
      // Pull requests detailed data
      Open_PRs: repo.pullRequestsData?.openCount,
      Closed_PRs: repo.pullRequestsData?.closedCount,
      Merged_PRs: repo.pullRequestsData?.mergedCount,
      
      // Traffic data
      Views_Count: repo.traffic?.views?.count,
      Views_Uniques: repo.traffic?.views?.uniques,
      Clones_Count: repo.traffic?.clones?.count,
      Clones_Uniques: repo.traffic?.clones?.uniques,
      
      // Community & other data
      Health_Percentage: repo.communityProfile?.healthPercentage,
      Has_Code_Of_Conduct: !!repo.communityProfile?.files?.codeOfConduct,
      Has_Contributing: !!repo.communityProfile?.files?.contributing,
      Has_License_File: !!repo.communityProfile?.files?.license,
      Git_References_Count: repo.gitReferencesCount,
      Git_LFS_Enabled: repo.gitLFSEnabled,
      Packages_Count: repo.packages,
      Package_Versions_Count: repo.packageVersions,
      
      // Repository settings
      Default_Branch: repo.settings?.defaultBranch,
      Visibility: repo.settings?.visibility,
      Issues_Enabled: repo.settings?.hasIssues,
      Projects_Enabled: repo.settings?.hasProjects,
      Discussions_Enabled: repo.settings?.hasDiscussions,
      Allow_Squash_Merge: repo.settings?.allowSquashMerge,
      Allow_Merge_Commit: repo.settings?.allowMergeCommit,
      Allow_Rebase_Merge: repo.settings?.allowRebaseMerge,
      Allow_Auto_Merge: repo.settings?.allowAutoMerge,
      Delete_Branch_On_Merge: repo.settings?.deleteBranchOnMerge,
      Allow_Forking: repo.settings?.allowForking,
      Web_Commit_Signoff_Required: repo.settings?.webCommitSignoffRequired,
      
      // Collaborators detailed (stored as JSON)
      Collaborators_Detailed: repo.collaboratorsDetailed ? JSON.stringify(repo.collaboratorsDetailed) : undefined,
      
      // Repository files
      Has_Readme: !!repo.repoFiles?.readme,
      Readme_Size: repo.repoFiles?.readme?.size,
      
      // License & topics
      License_Key: repo.license?.key,
      License_Name: repo.license?.name,
      License_SPDX_ID: repo.license?.spdxId,
      Topics: repo.topics ? JSON.stringify(repo.topics) : undefined,
      Topics_Count: repo.topics?.length || 0,
      
      // Deployments & environments
      Deployments_Count: repo.deployments?.length || 0,
      Deployments: repo.deployments ? JSON.stringify(repo.deployments) : undefined,
      Environments_Count: repo.environments?.length || 0,
      Environments: repo.environments ? JSON.stringify(repo.environments) : undefined,
      
      // Webhooks & team access
      Webhooks_Count: repo.webhooks?.length || 0,
      Webhooks: repo.webhooks ? JSON.stringify(repo.webhooks) : undefined,
      Team_Access: repo.teamAccess ? JSON.stringify(repo.teamAccess) : undefined,
      Team_Access_Count: repo.teamAccess?.length || 0,
      
      // Rulesets
      Rulesets_Count: repo.rulesets?.length || 0,
      Rulesets: repo.rulesets ? JSON.stringify(repo.rulesets) : undefined,
    };
  });

  return { repos: repositories, orgs };
}

