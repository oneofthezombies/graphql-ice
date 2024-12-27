import path from "node:path";
import { Plugin } from "vitest/config";

const WINDOWS_VOLUME_RE = /^[A-Z]:/i;
const WINDOWS_SLASH_RE = /\\/g;
const FS_PREFIX = `/@fs/`;

const isWindows =
  typeof process !== "undefined" && process.platform === "win32";

function slash(p: string) {
  return p.replace(WINDOWS_SLASH_RE, "/");
}

function normalizePath(id: string) {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

function fsPathFromId(id: string) {
  const fsPath = normalizePath(
    id.startsWith(FS_PREFIX) ? id.slice(FS_PREFIX.length) : id
  );
  return fsPath[0] === "/" || WINDOWS_VOLUME_RE.test(fsPath)
    ? fsPath
    : `/${fsPath}`;
}

export default function (): Plugin {
  return {
    name: "fix-cloudflare-vitest-pool-workers",
    resolveId(id) {
      if (id.includes("/@fs/") && !id.startsWith("/@fs/")) {
        const url = new URL(id, "http://base");
        return fsPathFromId(url.pathname);
      }
    },
  };
}
