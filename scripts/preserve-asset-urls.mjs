import { readdir, mkdir, copyFile } from "node:fs/promises"
import path from "node:path"

// Quartz lowercases asset slugs; also keep original Hugo image/video URLs.
const content = path.resolve("content")
const output = path.resolve("public")
let copied = 0

async function preserve(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) {
      await preserve(path.join(directory, entry.name), relative)
    } else {
      const destination = path.resolve(output, relative)
      if (!destination.startsWith(output + path.sep)) throw new Error("Invalid asset path")
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(path.join(content, relative), destination)
      copied++
    }
  }
}

await preserve(path.join(content, "images"), "images")
await preserve(path.join(content, "videos"), "videos")
console.log(`Preserved ${copied} original image/video URLs.`)
