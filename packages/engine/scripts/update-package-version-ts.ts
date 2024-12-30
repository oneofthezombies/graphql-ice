import fs from "node:fs";

const PACKAGE_VERSION_RE =
  /(?<prefix>\s*export\s+const\s+PACKAGE_VERSION\s*=\s*")(?<value>.*)(?<postfix>".*)/;
const PACKAGE_VERSION_REL_PATH = "src/package-version.ts";

function main() {
  let isUpdated = false;
  const lineUpdated: string[] = [];
  const packageVersion: string = JSON.parse(
    fs.readFileSync("package.json", "utf8")
  ).version;
  for (const line of fs
    .readFileSync(PACKAGE_VERSION_REL_PATH, "utf8")
    .split("\n")) {
    const match = line.match(PACKAGE_VERSION_RE);
    if (match) {
      const { prefix, value, postfix } = match.groups ?? {};
      console.log(`Package version updated from ${value} to ${packageVersion}`);
      lineUpdated.push(`${prefix}${packageVersion}${postfix}`);
      isUpdated = true;
    } else {
      lineUpdated.push(line);
    }
  }
  if (!isUpdated) {
    throw new Error("Package version not updated.");
  }
  fs.writeFileSync(PACKAGE_VERSION_REL_PATH, lineUpdated.join("\n"));
}

main();
