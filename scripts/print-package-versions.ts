import { globIterate } from "glob";
import fs from "node:fs";
import readline from "node:readline";

const filePatterns = [
  ".devcontainer/Dockerfile",
  "packages/*/package.json",
  "package.json",
];

const installPattern = /(?<name>[\w-@/]+)@(?<version>\d+\.\d+\.\d+)/g;
const dependencyPattern = /"(?<name>[\w-@/]+)":\s+"(?<version>\d+\.\d+\.\d+)"/g;
const patterns = [installPattern, dependencyPattern];
const nameFilters = ["version"];

const packageVersions = new Map<string, { file: string; version: string }[]>();

const fileIt = globIterate(filePatterns);
for await (const file of fileIt) {
  const stream = fs.createReadStream(file, "utf8");
  const lineIt = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of lineIt) {
    for (const pattern of patterns) {
      const matchIt = line.matchAll(pattern);
      for (const match of matchIt) {
        const { name, version } = match.groups ?? {};
        if (nameFilters.includes(name)) {
          continue;
        }
        if (!packageVersions.has(name)) {
          packageVersions.set(name, []);
        }
        packageVersions.get(name)!.push({ file, version });
      }
    }
  }
}

const names = packageVersions.keys().toArray().toSorted();
for (const name of names) {
  console.log(`${name}`);
  for (const { file, version } of packageVersions.get(name)!) {
    console.log(`  ${version} in ${file}`);
  }
}
