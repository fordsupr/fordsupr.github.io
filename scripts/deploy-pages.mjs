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
  git(["add", "-A"], temporary)
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
  if (checkoutReady) git(["worktree", "remove", temporary])
}
