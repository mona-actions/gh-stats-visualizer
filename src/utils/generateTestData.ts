import { faker } from "@faker-js/faker";
import fs from "fs";

/**
 * Interface matching the gh-github-stats org format
 */
interface GhGithubStatsOrg {
  login: string;
  id: number;
  nodeId: string;
  name: string;
  description: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  url: string;
  publicRepos: number;
  totalPrivateRepos: number;
  ownedPrivateRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  membersCount: number;
  outsideCollaboratorsCount: number;
  teamsCount: number;
  runnersCount: number;
  organizationRolesCount: number;
  createdAt: string;
  updatedAt: string;
  defaultRepoPermission: string;
  membersCanCreateRepos: boolean;
  membersCanCreatePublicRepos: boolean;
  membersCanCreatePrivateRepos: boolean;
  membersCanForkPrivateRepos: boolean;
  actionsSecrets: any[];
  actionsVariables: any[];
}

/**
 * Interface matching the gh-github-stats JSON output format
 */
interface GhGithubStatsRepo {
  org: string;
  name: string;
  url: string;
  isFork: boolean;
  isArchived: boolean;
  diskUsage: number; // In KB
  hasWikiEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  collaborators: number;
  branches: number;
  tags: number;
  branchProtections: number;
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
  
  // Language data
  languages?: Record<string, number>;
  
  // Topics
  topics?: string[];
  
  // License
  license?: {
    key: string;
    name: string;
    spdxId: string;
  };
}

interface GhGithubStatsOutput {
  orgs: GhGithubStatsOrg[];
  repos: GhGithubStatsRepo[];
}

interface GenerateOptions {
  recordCount: number;
  uniqueOrgCount?: number;
}

// Popular programming languages with realistic weights
const LANGUAGES = [
  { name: "JavaScript", weight: 20 },
  { name: "TypeScript", weight: 18 },
  { name: "Python", weight: 15 },
  { name: "Java", weight: 12 },
  { name: "Go", weight: 10 },
  { name: "Ruby", weight: 8 },
  { name: "Rust", weight: 5 },
  { name: "C++", weight: 4 },
  { name: "C#", weight: 4 },
  { name: "PHP", weight: 3 },
  { name: "Swift", weight: 2 },
  { name: "Kotlin", weight: 2 },
  { name: "Shell", weight: 1 },
  { name: "HTML", weight: 1 },
  { name: "CSS", weight: 1 },
];

// Popular topics
const TOPICS = [
  "react", "nodejs", "javascript", "typescript", "python", "golang", "rust",
  "docker", "kubernetes", "api", "cli", "web", "mobile", "backend", "frontend",
  "machine-learning", "ai", "blockchain", "devops", "testing", "security",
  "database", "microservices", "serverless", "automation", "monitoring",
];

// Common licenses
const LICENSES = [
  { key: "mit", name: "MIT License", spdxId: "MIT" },
  { key: "apache-2.0", name: "Apache License 2.0", spdxId: "Apache-2.0" },
  { key: "gpl-3.0", name: "GNU General Public License v3.0", spdxId: "GPL-3.0" },
  { key: "bsd-3-clause", name: "BSD 3-Clause License", spdxId: "BSD-3-Clause" },
  { key: "isc", name: "ISC License", spdxId: "ISC" },
  { key: "lgpl-3.0", name: "GNU Lesser General Public License v3.0", spdxId: "LGPL-3.0" },
  { key: "mpl-2.0", name: "Mozilla Public License 2.0", spdxId: "MPL-2.0" },
];

function generateUniqueOrgNames(count: number): string[] {
  const orgNames = new Set<string>();
  while (orgNames.size < count) {
    orgNames.add(
      faker.internet
        .userName()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
    );
  }
  return Array.from(orgNames);
}

function generateOrgStats(orgName: string, repoCount: number): GhGithubStatsOrg {
  const createdAt = faker.date.past({ years: 10 }).toISOString();
  const updatedAt = faker.date.recent({ days: 30 }).toISOString();
  
  const publicRepos = Math.floor(repoCount * faker.number.float({ min: 0.3, max: 0.7 }));
  const totalPrivateRepos = repoCount - publicRepos;
  
  return {
    login: orgName,
    id: faker.number.int({ min: 1000000, max: 99999999 }),
    nodeId: `MDEyOk9yZ2FuaXphdGlvbiR7faker.string.alphanumeric(8)}`,
    name: faker.company.name(),
    description: faker.datatype.boolean(0.7) ? faker.company.catchPhrase() : null,
    blog: faker.datatype.boolean(0.5) ? faker.internet.url() : null,
    location: faker.datatype.boolean(0.6) ? faker.location.city() : null,
    email: faker.datatype.boolean(0.4) ? faker.internet.email() : null,
    url: `https://github.com/${orgName}`,
    publicRepos,
    totalPrivateRepos,
    ownedPrivateRepos: totalPrivateRepos,
    publicGists: faker.number.int({ min: 0, max: 50 }),
    followers: faker.number.int({ min: 0, max: 5000 }),
    following: faker.number.int({ min: 0, max: 100 }),
    membersCount: faker.number.int({ min: 5, max: 500 }),
    outsideCollaboratorsCount: faker.number.int({ min: 0, max: 50 }),
    teamsCount: faker.number.int({ min: 1, max: 50 }),
    runnersCount: faker.number.int({ min: 0, max: 20 }),
    organizationRolesCount: faker.number.int({ min: 3, max: 10 }),
    createdAt,
    updatedAt,
    defaultRepoPermission: faker.helpers.arrayElement(['read', 'write', 'admin', 'none']),
    membersCanCreateRepos: faker.datatype.boolean(0.8),
    membersCanCreatePublicRepos: faker.datatype.boolean(0.6),
    membersCanCreatePrivateRepos: faker.datatype.boolean(0.9),
    membersCanForkPrivateRepos: faker.datatype.boolean(0.5),
    actionsSecrets: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => ({
      name: faker.lorem.word().toUpperCase() + '_SECRET',
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    })),
    actionsVariables: Array.from({ length: faker.number.int({ min: 0, max: 15 }) }, () => ({
      name: faker.lorem.word().toUpperCase() + '_VAR',
      value: faker.lorem.word(),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    })),
  };
}

function getActivityLevel(): { level: number; veryHigh: boolean } {
  // Generate a weighted random number to create a more realistic distribution
  const rand = Math.random();
  // Distribution weights:
  // No activity: 20%
  // Low activity: 30%
  // Medium activity: 25%
  // High activity: 15%
  // Very high activity: 10%
  if (rand < 0.2)
    return { level: faker.number.int({ min: 0, max: 20 }), veryHigh: false };
  if (rand < 0.5)
    return { level: faker.number.int({ min: 21, max: 40 }), veryHigh: false };
  if (rand < 0.75)
    return { level: faker.number.int({ min: 41, max: 60 }), veryHigh: false };
  if (rand < 0.9)
    return { level: faker.number.int({ min: 61, max: 80 }), veryHigh: false };
  return { level: faker.number.int({ min: 81, max: 100 }), veryHigh: true };
}

function generateLanguages(): Record<string, number> {
  // Pick 1-4 languages for this repo
  const languageCount = faker.number.int({ min: 1, max: 4 });
  const selectedLanguages = faker.helpers.arrayElements(LANGUAGES, languageCount);
  
  const languages: Record<string, number> = {};
  let remaining = 100;
  
  selectedLanguages.forEach((lang, index) => {
    if (index === selectedLanguages.length - 1) {
      // Last language gets the remaining percentage
      languages[lang.name] = remaining * 1000; // Multiply by 1000 to represent bytes
    } else {
      // Weight the distribution
      const percentage = faker.number.int({ min: 10, max: remaining - (selectedLanguages.length - index - 1) * 10 });
      languages[lang.name] = percentage * 1000;
      remaining -= percentage;
    }
  });
  
  return languages;
}

function generateRepoStats(orgNames?: string[]): GhGithubStatsRepo {
  const orgName = orgNames
    ? faker.helpers.arrayElement(orgNames)
    : faker.internet
        .userName()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
  const repoName = faker.helpers
    .arrayElement([
      faker.internet.domainWord(),
      faker.system.fileName().replace(/\.[^.]*$/, ""), // Remove extension
      faker.company.buzzNoun(),
    ])
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  const createdAt = faker.date.past({ years: 5 }).toISOString();
  const updatedAt = faker.date
    .between({ from: createdAt, to: new Date().toISOString() })
    .toISOString();
  const pushedAt = faker.date
    .between({ from: updatedAt, to: new Date().toISOString() })
    .toISOString();

  // Generate activity level (0-100) to determine engagement metrics
  const { level: activityLevel, veryHigh } = getActivityLevel();

  // Base metrics that scale with activity level
  let baseMetrics;
  if (veryHigh) {
    // For very high activity, allow sum to exceed 1000
    baseMetrics = {
      issueCount: Math.floor(activityLevel * 10), // 810-1000
      prCount: Math.floor(activityLevel * 5), // 405-500
    };
  } else {
    baseMetrics = {
      issueCount: Math.floor(activityLevel * 2.5), // 0-250
      prCount: Math.floor(activityLevel * 2), // 0-200
    };
  }
  
  // Other metrics scale with activity
  const baseOtherMetrics = {
    commitCommentCount: Math.floor(activityLevel * 0.8),
    issueEventCount: Math.floor(activityLevel * 0.8),
    releaseCount: Math.floor(activityLevel * 0.3),
    projectCount: Math.floor(activityLevel * 0.5),
    branchCount: Math.floor(activityLevel * 0.6) + 1,
    tagCount: Math.floor(activityLevel * 0.3),
    discussionCount: Math.floor(activityLevel * 0.8),
  };

  // Add some randomness to the base metrics
  const addRandomness = (base: number) => {
    const variance = Math.floor(base * 0.2); // 20% variance
    return Math.max(
      0,
      base + faker.number.int({ min: -variance, max: variance })
    );
  };

  const repo: GhGithubStatsRepo = {
    org: orgName,
    name: repoName,
    url: `https://github.com/${orgName}/${repoName}`,
    isFork: faker.datatype.boolean(0.2),
    isArchived: faker.datatype.boolean(0.1),
    diskUsage: faker.number.int({ min: 0, max: 102400 }), // 0-100 MB in KB
    hasWikiEnabled: faker.datatype.boolean(0.7),
    createdAt,
    updatedAt,
    pushedAt,
    collaborators: faker.number.int({ min: 1, max: 50 }),
    branches: addRandomness(baseOtherMetrics.branchCount),
    tags: addRandomness(baseOtherMetrics.tagCount),
    branchProtections: faker.number.int({ min: 0, max: 5 }),
    issues: addRandomness(baseMetrics.issueCount),
    pullRequests: addRandomness(baseMetrics.prCount),
    milestones: faker.number.int({ min: 0, max: 10 }),
    releases: addRandomness(baseOtherMetrics.releaseCount),
    projects: addRandomness(baseOtherMetrics.projectCount),
    discussions: addRandomness(baseOtherMetrics.discussionCount),
    commitComments: addRandomness(baseOtherMetrics.commitCommentCount),
    issueEvents: addRandomness(baseOtherMetrics.issueEventCount),
    packages: faker.datatype.boolean(0.1) ? faker.number.int({ min: 1, max: 5 }) : 0,
    packageVersions: faker.datatype.boolean(0.1) ? faker.number.int({ min: 1, max: 20 }) : 0,
    
    // Add languages (85% of repos have languages)
    languages: faker.datatype.boolean(0.85) ? generateLanguages() : undefined,
    
    // Add topics (60% of repos have topics)
    topics: faker.datatype.boolean(0.6) 
      ? faker.helpers.arrayElements(TOPICS, faker.number.int({ min: 1, max: 8 }))
      : undefined,
    
    // Add license (70% of repos have licenses)
    license: faker.datatype.boolean(0.7) 
      ? faker.helpers.arrayElement(LICENSES)
      : undefined,
  };

  return repo;
}

export function generateTestData(options: GenerateOptions): string {
  const { recordCount, uniqueOrgCount } = options;
  console.log(
    `Generating ${recordCount} repositories across ${uniqueOrgCount || 'random'} organizations...`
  );
  
  const orgNames = uniqueOrgCount
    ? generateUniqueOrgNames(uniqueOrgCount)
    : undefined;

  // Generate repository data
  const repos = Array.from({ length: recordCount }, () =>
    generateRepoStats(orgNames)
  );
  
  // Generate organization data
  const orgs: GhGithubStatsOrg[] = [];
  if (orgNames) {
    // Count repos per org
    const orgRepoCount = new Map<string, number>();
    repos.forEach(repo => {
      orgRepoCount.set(repo.org, (orgRepoCount.get(repo.org) || 0) + 1);
    });
    
    // Generate org stats for each unique org
    orgNames.forEach(orgName => {
      const repoCount = orgRepoCount.get(orgName) || 0;
      orgs.push(generateOrgStats(orgName, repoCount));
    });
  }
  
  const output: GhGithubStatsOutput = {
    orgs,
    repos,
  };
  
  const jsonData = JSON.stringify(output, null, 2);
  console.log(
    "Data generated successfully. First few characters:",
    jsonData.substring(0, 500)
  );
  console.log(`\nGenerated:`);
  console.log(`  - ${orgs.length} organizations`);
  console.log(`  - ${repos.length} repositories`);
  
  return jsonData;
}

// Example usage:
// const jsonData = generateTestData({ recordCount: 100, uniqueOrgCount: 10 });
// console.log(jsonData);

// Handle command line execution
if (process.argv[1] && process.argv[1].endsWith("generateTestData.ts")) {
  const recordCount = parseInt(process.argv[2], 10);
  const uniqueOrgCount = parseInt(process.argv[3], 10);
  const outputFile = process.argv[4] || "repo-stats.json";

  if (isNaN(recordCount) || isNaN(uniqueOrgCount)) {
    console.error(
      "Usage: npm run generate-data <recordCount> <uniqueOrgCount> [outputFile]"
    );
    console.error("Example: npm run generate-data 100 5 test-data.json");
    process.exit(1);
  }

  const jsonData = generateTestData({ recordCount, uniqueOrgCount });
  fs.writeFileSync(outputFile, jsonData, "utf8");
  console.log(`\nJSON data written to ${outputFile}`);
}