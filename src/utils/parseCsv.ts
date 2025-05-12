/**
 * parseCsv.ts
 *
 * Provides a function to parse an array of Repository objects (from CSV) and calculate all relevant repository statistics.
 * Performs a single-pass aggregation for performance, including activity, size, update frequency, organization, collaboration, and more.
 */

import type { Stats, Repository } from "@types";

/**
 * Parses repository data and calculates all relevant statistics for dashboard display.
 * Performs a single-pass aggregation for performance, including activity, size, update frequency, organization, collaboration, and more.
 *
 * @param data - Array of Repository objects parsed from CSV.
 * @returns Stats object with all calculated metrics for the dashboard.
 */
export default function parseCsvAndCalculateStats(data: Repository[]): Stats {
  // Initialize all counters and aggregators
  const basic = {
    totalRepos: data.length,
    totalSize: 0,
    totalIssues: 0,
    totalPRs: 0,
    totalCommitComments: 0,
    totalMilestones: 0,
    totalReleases: 0,
    totalCollaborators: 0,
    totalProtectedBranches: 0,
    totalProjects: 0,
    totalTags: 0,
    totalIssueComments: 0,
    totalPRReviewComments: 0,
    totalBranches: 0,
    totalDiscussions: 0,
    totalPRReviews: 0,
    totalIssueEvents: 0,
    totalWikis: 0,
    totalForks: 0,
    totalArchived: 0,
    totalEmpty: 0
  };

  // Initialize aggregation objects
  const activityLevels = {
    "No activity": 0,
    "Low activity": 0,
    "Medium activity": 0,
    "High activity": 0,
    "Very high activity": 0,
  };

  const sizeGroups = {
    "Less than 1 MB": 0,
    "1–10 MB": 0,
    "10–100 MB": 0,
    "100–1000 MB": 0,
    "More than 1000 MB": 0,
  };

  const updateBuckets: Record<string, number> = {
    "Past week": 0,
    "Past month": 0,
    "Past 3 months": 0,
    "Past year": 0,
    "1-2 years ago": 0,
    "2+ years ago": 0,
  };

  const branchGroups = {
    "Single branch": 0,
    "2–5 branches": 0,
    "6–10 branches": 0,
    "More than 10 branches": 0,
  };

  const orgMap = new Map<string, number>();
  const yearMap = new Map<number, number>();
  
  // For sorting operations later
  const reposBySize: {name: string; value: number}[] = [];
  const reposByActivity: {name: string; issues: number; prs: number; total: number}[] = [];
  const reposByAge: {name: string; created: Date; ageInDays: number; ageInYears: number}[] = [];
  const reposByLastPush: {name: string; lastPush: Date}[] = [];
  
  // For collaboration stats
  const collaboratorRanges = [
    { min: 0, max: 1, label: "0-1", count: 0 },
    { min: 2, max: 5, label: "2-5", count: 0 },
    { min: 6, max: 10, label: "6-10", count: 0 },
    { min: 11, max: 20, label: "11-20", count: 0 },
    { min: 21, max: Infinity, label: "21+", count: 0 },
  ];

  const featureCounts = {
    issues: 0,
    pullRequests: 0,
    discussions: 0,
    projects: 0,
    wiki: 0,
    protectedBranches: 0,
    milestones: 0,
  };

  const now = new Date();

  // Single pass through the data
  data.forEach(repo => {
    // Basic counters
    const repoSize = repo.Repo_Size_MB || 0;
    const issueCount = repo.Issue_Count || 0;
    const prCount = repo.Pull_Request_Count || 0;
    const activity = issueCount + prCount;
    
    // Update basic stats
    basic.totalSize += repoSize;
    basic.totalIssues += issueCount;
    basic.totalPRs += prCount;
    basic.totalCommitComments += repo.Commit_Comment_Count || 0;
    basic.totalMilestones += repo.Milestone_Count || 0;
    basic.totalReleases += repo.Release_Count || 0;
    basic.totalCollaborators += repo.Collaborator_Count || 0;
    basic.totalProtectedBranches += repo.Protected_Branch_Count || 0;
    basic.totalProjects += repo.Project_Count || 0;
    basic.totalTags += repo.Tag_Count || 0;
    basic.totalIssueComments += repo.Issue_Comment_Count || 0;
    basic.totalPRReviewComments += repo.PR_Review_Comment_Count || 0;
    basic.totalBranches += repo.Branch_Count || 0;
    basic.totalDiscussions += repo.Discussion_Count || 0;
    basic.totalPRReviews += repo.PR_Review_Count || 0;
    basic.totalIssueEvents += repo.Issue_Event_Count || 0;
    basic.totalWikis += repo.Has_Wiki || 0;
    
    if (repo.Is_Fork) basic.totalForks++;
    if (repo.Is_Archived) basic.totalArchived++;
    if (repo.Is_Empty) basic.totalEmpty++;

    // Repository name for display
    const repoName = `${repo.Org_Name}/${repo.Repo_Name}`;
    
    // Activity levels
    if (activity === 0) activityLevels["No activity"]++;
    else if (activity < 10) activityLevels["Low activity"]++;
    else if (activity < 100) activityLevels["Medium activity"]++;
    else if (activity < 1000) activityLevels["High activity"]++;
    else activityLevels["Very high activity"]++;
    
    // Size groups
    if (repoSize < 1) sizeGroups["Less than 1 MB"]++;
    else if (repoSize < 10) sizeGroups["1–10 MB"]++;
    else if (repoSize < 100) sizeGroups["10–100 MB"]++;
    else if (repoSize < 1000) sizeGroups["100–1000 MB"]++;
    else sizeGroups["More than 1000 MB"]++;
    
    // Organization counts
    const orgName = repo.Org_Name || "Unknown";
    orgMap.set(orgName, (orgMap.get(orgName) || 0) + 1);
    
    // Branch distribution
    const branches = repo.Branch_Count || 0;
    if (branches <= 1) branchGroups["Single branch"]++;
    else if (branches <= 5) branchGroups["2–5 branches"]++;
    else if (branches <= 10) branchGroups["6–10 branches"]++;
    else branchGroups["More than 10 branches"]++;
    
    // Year data
    if (repo.Created) {
      const created = new Date(repo.Created);
      const year = created.getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + 1);
      
      // Calculate age
      const ageInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      const ageInYears = ageInDays / 365;
      
      reposByAge.push({
        name: repoName,
        created,
        ageInDays,
        ageInYears: parseFloat(ageInYears.toFixed(1))
      });
    }
    
    // Update frequency
    if (repo.Last_Push) {
      const lastPush = new Date(repo.Last_Push);
      reposByLastPush.push({ name: repoName, lastPush });
      
      const days = (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
      if (days < 7) updateBuckets["Past week"]++;
      else if (days < 30) updateBuckets["Past month"]++;
      else if (days < 90) updateBuckets["Past 3 months"]++;
      else if (days < 365) updateBuckets["Past year"]++;
      else if (days < 730) updateBuckets["1-2 years ago"]++;
      else updateBuckets["2+ years ago"]++;
    }
    
    // Add to arrays for sorting later
    reposBySize.push({ name: repoName, value: repoSize });
    
    reposByActivity.push({
      name: repoName,
      issues: issueCount,
      prs: prCount,
      total: activity
    });
    
    // Collaborator ranges
    const collaboratorCount = repo.Collaborator_Count || 0;
    for (const range of collaboratorRanges) {
      if (collaboratorCount >= range.min && collaboratorCount <= range.max) {
        range.count++;
        break;
      }
    }
    
    // Feature distribution
    if (issueCount > 0) featureCounts.issues++;
    if (prCount > 0) featureCounts.pullRequests++;
    if ((repo.Discussion_Count || 0) > 0) featureCounts.discussions++;
    if ((repo.Project_Count || 0) > 0) featureCounts.projects++;
    if ((repo.Has_Wiki || 0) > 0) featureCounts.wiki++;
    if ((repo.Protected_Branch_Count || 0) > 0) featureCounts.protectedBranches++;
    if ((repo.Milestone_Count || 0) > 0) featureCounts.milestones++;
  });
  
  // Sort and slice arrays after the single pass
  reposBySize.sort((a, b) => b.value - a.value);
  reposByActivity.sort((a, b) => b.total - a.total);
  reposByAge.sort((a, b) => b.ageInDays - a.ageInDays);
  reposByLastPush.sort((a, b) => b.lastPush.getTime() - a.lastPush.getTime());
  
  const largestRepos = reposBySize.slice(0, 10);
  const mostActiveRepos = reposByActivity.slice(0, 10);
  const oldestRepos = [...reposByAge].sort((a, b) => a.created.getTime() - b.created.getTime()).slice(0, 20)
    .map(r => ({ name: r.name, created: r.created.toLocaleDateString() }));
  const newestRepos = [...reposByAge].sort((a, b) => b.created.getTime() - a.created.getTime()).slice(0, 20)
    .map(r => ({ name: r.name, created: r.created.toLocaleDateString() }));
  const recentlyUpdated = reposByLastPush.slice(0, 20)
    .map(r => ({ name: r.name, lastPush: r.lastPush.toLocaleDateString() }));

  // Convert maps to arrays
  const yearData = Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
  
  const orgData = Array.from(orgMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Format activity data
  const activityData = Object.entries(activityLevels).map(([name, value]) => ({
    name,
    value,
  }));

  // Format update data
  const updateData = Object.entries(updateBuckets).map(([name, value]) => ({
    name,
    value,
  }));

  // Format size data
  const sizeData = Object.entries(sizeGroups).map(([name, value]) => ({
    name,
    value,
  }));

  // Format branch data
  const branchData = Object.entries(branchGroups).map(([name, value]) => ({
    name,
    value,
  }));

  // Format collaboration stats
  const collaboratorDistribution = collaboratorRanges.map(range => ({
    range: range.label,
    count: range.count
  }));

  // Calculate top collaborator repos
  const topCollaboratorRepos = data
    .map(repo => ({
      name: `${repo.Org_Name}/${repo.Repo_Name}`,
      collaboratorCount: repo.Collaborator_Count || 0
    }))
    .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
    .slice(0, 10);

  // Format feature distribution
  const featureDistribution = [
    { feature: "Issues", count: featureCounts.issues, total: data.length },
    { feature: "Pull Requests", count: featureCounts.pullRequests, total: data.length },
    { feature: "Discussions", count: featureCounts.discussions, total: data.length },
    { feature: "Projects", count: featureCounts.projects, total: data.length },
    { feature: "Wiki", count: featureCounts.wiki, total: data.length },
    { feature: "Protected Branches", count: featureCounts.protectedBranches, total: data.length },
    { feature: "Milestones", count: featureCounts.milestones, total: data.length },
  ].filter(feature => feature.count > 0);

  // Calculate more complex metrics that require multiple fields
  const metadataRatios = data
    .map(repo => {
      const size = repo.Repo_Size_MB || 0;
      const metadata = (repo.Issue_Count || 0) + 
                      (repo.Pull_Request_Count || 0) + 
                      (repo.Commit_Comment_Count || 0);
      
      return {
        name: `${repo.Org_Name}/${repo.Repo_Name}`,
        size,
        metadata,
        ratio: metadata === 0 ? 0 : size / metadata
      };
    })
    .filter(r => r.size > 0 && r.metadata > 0)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 10);

  // Branch complexity calculations
  const branchComplexity = data
    .filter(r => r.Branch_Count && r.Created)
    .map(r => {
      const branches = r.Branch_Count!;
      const size = r.Repo_Size_MB || 1;
      const created = new Date(r.Created!);
      const ageYears = Math.max(
        1,
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );

      return {
        name: `${r.Org_Name}/${r.Repo_Name}`,
        branches,
        size,
        age: ageYears.toFixed(1),
        complexityBySize: branches / size,
        complexityByAge: branches / ageYears,
      };
    })
    .sort((a, b) => b.complexityBySize - a.complexityBySize)
    .slice(0, 10);

  // Tag release frequency calculations
  const tagReleaseFrequency = data
    .filter(r => (r.Tag_Count || 0) > 0 || (r.Release_Count || 0) > 0)
    .map(r => {
      const tags = r.Tag_Count || 0;
      const releases = r.Release_Count || 0;
      const created = new Date(r.Created || new Date());
      const ageYears = Math.max(
        1,
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );

      return {
        name: `${r.Org_Name}/${r.Repo_Name}`,
        tags,
        releases,
        age: ageYears.toFixed(1),
        tagsPerYear: tags / ageYears,
        releasesPerYear: releases / ageYears,
        total: (tags + releases) / ageYears,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const repositoryAge = reposByAge
    .sort((a, b) => b.ageInDays - a.ageInDays)
    .slice(0, 10)
    .map(r => ({
      name: r.name,
      ageInDays: r.ageInDays,
      ageInYears: r.ageInYears
    }));

  // Assemble and return the result
  return {
    basic,
    activityData,
    sizeData,
    updateData,
    orgData,
    yearData,
    branchData,
    largestRepos,
    mostActiveRepos,
    newestRepos,
    oldestRepos,
    recentlyUpdated,
    metadataRatios,
    branchComplexity,
    tagReleaseFrequency,
    repositoryAge,
    collaborationStats: {
      collaboratorDistribution,
      topCollaboratorRepos,
      featureDistribution
    }
  };
}