import { buildEngineJs, run } from "../../../scripts/build-engine-js.js";
import { updatePackageVersionTs } from "./update-package-version-ts.js";

function main() {
  buildEngineJs();
  updatePackageVersionTs();
  run("vite", ["build"]);
}

main();
