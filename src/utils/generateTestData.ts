import { faker } from "@faker-js/faker";
import Papa from "papaparse";
import fs from "fs";

interface RepoStats {
  Org_Name: string;
  Repo_Name: string;
  Is_Empty: boolean;
  Last_Push: string;
  Last_Update: string;
  Is_Fork: boolean;
  Is_Archived: boolean;
  Repo_Size_MB: number;
  Collaborator_Count: number;
  Protected_Branch_Count: number;
  Milestone_Count: number;
  Issue_Count: number;
  Pull_Request_Count: number;
  PR_Review_Count: number;
  PR_Review_Comment_Count: number;
  Commit_Comment_Count: number;
  Issue_Comment_Count: number;
  Issue_Event_Count: number;
  Release_Count: number;
  Project_Count: number;
  Branch_Count: number;
  Tag_Count: number;
  Discussion_Count: number;
  Has_Wiki: number;
  Repo_URL: string;
  Migration_Issue: boolean;
  Created: string;
}

interface GenerateOptions {
  recordCount: number;
  uniqueOrgCount?: number;
}

function generateUniqueOrgNames(count: number): string[] {
  const orgNames = new Set<string>();
  while (orgNames.size < count) {
    orgNames.add(
      faker.internet
        .userName()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    );
  }
  return Array.from(orgNames);
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

function generateRepoStats(orgNames?: string[]): RepoStats {
  const orgName = orgNames
    ? faker.helpers.arrayElement(orgNames)
    : faker.internet
        .userName()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
  const repoName = faker.helpers
    .arrayElement([
      faker.internet.domainWord(),
      faker.system.fileName(),
      faker.company.buzzNoun(),
    ])
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const created = faker.date.past({ years: 5 }).toISOString();
  const lastUpdate = faker.date
    .between({ from: created, to: new Date().toISOString() })
    .toISOString();
  const lastPush = faker.date
    .between({ from: lastUpdate, to: new Date().toISOString() })
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
  // Other metrics scale as before
  const baseOtherMetrics = {
    prReviewCount: Math.floor(activityLevel * 1.2),
    prReviewCommentCount: Math.floor(activityLevel * 1.8),
    commitCommentCount: Math.floor(activityLevel * 0.8),
    issueCommentCount: Math.floor(activityLevel * 1.8),
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

  return {
    Org_Name: orgName,
    Repo_Name: repoName,
    Is_Empty: faker.datatype.boolean(0.1),
    Last_Push: lastPush,
    Last_Update: lastUpdate,
    Is_Fork: faker.datatype.boolean(0.2),
    Is_Archived: faker.datatype.boolean(0.1),
    Repo_Size_MB: faker.number.int({ min: 0, max: 100000 }),
    Collaborator_Count: faker.number.int({ min: 1, max: 50 }),
    Protected_Branch_Count: faker.number.int({ min: 0, max: 5 }),
    Milestone_Count: faker.number.int({ min: 0, max: 10 }),
    Issue_Count: addRandomness(baseMetrics.issueCount),
    Pull_Request_Count: addRandomness(baseMetrics.prCount),
    PR_Review_Count: addRandomness(baseOtherMetrics.prReviewCount),
    PR_Review_Comment_Count: addRandomness(
      baseOtherMetrics.prReviewCommentCount
    ),
    Commit_Comment_Count: addRandomness(baseOtherMetrics.commitCommentCount),
    Issue_Comment_Count: addRandomness(baseOtherMetrics.issueCommentCount),
    Issue_Event_Count: addRandomness(baseOtherMetrics.issueEventCount),
    Release_Count: addRandomness(baseOtherMetrics.releaseCount),
    Project_Count: addRandomness(baseOtherMetrics.projectCount),
    Branch_Count: addRandomness(baseOtherMetrics.branchCount),
    Tag_Count: addRandomness(baseOtherMetrics.tagCount),
    Discussion_Count: addRandomness(baseOtherMetrics.discussionCount),
    Has_Wiki: faker.datatype.boolean(0.7) ? 1 : 0,
    Repo_URL: `https://github.com/${orgName}/${repoName}`,
    Migration_Issue: faker.datatype.boolean(0.1),
    Created: created,
  };
}

export function generateTestData(options: GenerateOptions): string {
  const { recordCount, uniqueOrgCount } = options;
  console.log(
    `Generating ${recordCount} records with ${uniqueOrgCount} unique organizations...`
  );
  const orgNames = uniqueOrgCount
    ? generateUniqueOrgNames(uniqueOrgCount)
    : undefined;

  const data = Array.from({ length: recordCount }, () =>
    generateRepoStats(orgNames)
  );
  const csvData = Papa.unparse(data);
  console.log(
    "Data generated successfully. First few characters:",
    csvData.substring(0, 1000)
  );
  return csvData;
}

// Example usage:
// const csvData = generateTestData({ recordCount: 1000, uniqueOrgCount: 10 });
// console.log(csvData);

// Handle command line execution
if (process.argv[1] && process.argv[1].endsWith("generateTestData.ts")) {
  const recordCount = parseInt(process.argv[2], 10);
  const uniqueOrgCount = parseInt(process.argv[3], 10);
  const outputFile = process.argv[4];

  if (isNaN(recordCount) || isNaN(uniqueOrgCount)) {
    console.error(
      "Usage: npm run generate-data <recordCount> <uniqueOrgCount> [outputFile]"
    );
    process.exit(1);
  }

  const csvData = generateTestData({ recordCount, uniqueOrgCount });
  if (outputFile) {
    fs.writeFileSync(outputFile, csvData, "utf8");
    console.log(`CSV data written to ${outputFile}`);
  } else {
    console.log("Final CSV data length:", csvData.length);
    console.log(csvData);
  }
}
