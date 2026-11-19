import { mkdtemp, readdir, mkdir, copyFile, unlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

const source = path.resolve("public")
const temporary = await mkdtemp(path.join(tmpdir(), "fordsupr-quartz-pages-"))
let checkoutReady = false

function git(args, cwd = process.cwd(), capture = false) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  })
  if (result.status !== 0) throw new Error(`Git command failed: ${args[0]}\n${result.stderr ?? ""}`)
  return result.stdout ?? ""
}

async function collect(directory, prefix = "", result = new Set()) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) await collect(path.join(directory, entry.name), relative, result)
    else result.add(relative)
  }
  return result
}

function destination(relative) {
  const resolved = path.resolve(temporary, relative)
  if (!resolved.startsWith(temporary + path.sep)) throw new Error("Invalid publish path")
  return resolved
}

try {
  const generated = await collect(source)
  if (!generated.has("index.html")) throw new Error("Build Quartz before publishing")
  git(["fetch", "origin", "main"])
  git(["worktree", "add", "--detach", temporary, "origin/main"])
  checkoutReady = true

  const tracked = git(["ls-files", "-z"], temporary, true).split("\0").filter(Boolean)
  for (const relative of tracked) {
    if (!generated.has(relative)) await unlink(destination(relative))
  }
  for (const relative of generated) {
    const target = destination(relative)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(source, relative), target)
  }
  await writeFile(destination(".nojekyll"), "")
  // Stage Quartz's lowercase paths exactly, even on Windows.
  git(["-c", "core.ignorecase=false", "-c", "core.autocrlf=false", "add", "-A"], temporary)
  // Git trees can preserve both asset spellings even when the local filesystem cannot.
  for (const folder of ["images", "videos"]) {
    const assets = await collect(path.resolve("content", folder), folder)
    for (const relative of assets) {
      const original = path.resolve("content", relative)
      const blob = git(["hash-object", "-w", original], temporary, true).trim()
      git(
        [
          "-c",
          "core.ignorecase=false",
          "update-index",
          "--add",
          "--cacheinfo",
          "100644",
          blob,
          relative,
        ],
        temporary,
      )
    }
  }
  const difference = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: temporary })
  if (difference.status === 0) {
    console.log("Published files are already current.")
  } else if (difference.status === 1) {
    git(["commit", "--quiet", "-m", "Publish Quartz official default template"], temporary)
    git(["push", "origin", "HEAD:main"], temporary)
    console.log(`Published ${git(["rev-parse", "HEAD"], temporary, true).trim()}`)
  } else {
    throw new Error("Unable to inspect staged deployment")
  }
} finally {
  if (checkoutReady) {
    if (
      path.dirname(temporary) !== path.resolve(tmpdir()) ||
      !path.basename(temporary).startsWith("fordsupr-quartz-pages-")
    ) {
      throw new Error("Invalid publish checkout cleanup path")
    }
    // This isolated, generated checkout may contain case-only aliases that Windows cannot represent.
    git(["worktree", "remove", "--force", temporary])
  }
}
