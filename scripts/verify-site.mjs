import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"

const output = path.resolve("public")
const site = "https://fordsupr.github.io"
const files = new Set()

async function collect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) await collect(path.join(directory, entry.name), relative)
    else files.add(relative)
  }
}

await collect(output)

function resolveFile(url) {
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, "")
  const candidates = pathname.endsWith("/")
    ? [pathname + "index.html"]
    : [pathname || "index.html", pathname + ".html", pathname + "/index.html"]
  const result = candidates.find((candidate) => files.has(candidate))
  assert.ok(result, `Missing local link or asset: ${url.pathname}`)
  return result
}

const pages = [
  "index.html",
  "profile.html",
  "resume.html",
  "get-in-touch.html",
  "notes/index.html",
  "notes/sap-agent-integration.html",
  "notes/sap-mcp-poc.html",
  "notes/automation-journey-2021-2025.html",
]
let links = 0
for (const page of pages) {
  assert.ok(files.has(page), `Missing page: ${page}`)
  const html = await readFile(path.join(output, page), "utf8")
  assert.match(html, /name="generator" content="Quartz"/)
  assert.doesNotMatch(html, /\{\{<|bootstrap\.min|sap-for-agents|Jack-Liang|USE_ET_DATA_4_RETURN/)
  const tree = fromHtml(html)
  visit(tree, "element", (node) => {
    for (const name of ["href", "src", "poster"]) {
      const value = node.properties?.[name]
      if (typeof value !== "string" || !value || value.startsWith("#")) continue
      const url = new URL(value, `${site}/${page}`)
      if (url.origin !== site || !["http:", "https:"].includes(url.protocol)) continue
      resolveFile(url)
      links++
    }
  })
}

const summary = "notes/automation-journey-2021-2025.html"
const legacy = {
  about: "profile.html",
  blog: "notes/index.html",
  search: "index.html",
  contact: "get-in-touch.html",
  "blog/resume": "resume.html",
  "blog/sapagent202611": "notes/sap-agent-integration.html",
  "blog/sapmcp202603": "notes/sap-mcp-poc.html",
  "blog/ai-agent-sap-journey-2021-2025": summary,
}
for (const name of [
  "helloworld",
  "sap_erp",
  "rpa",
  "pyrfc",
  "pywithrpa",
  "pyrfc_over512",
  "poetry",
  "qabot",
  "rpa2023",
  "llamaqa",
  "rpa2024q4",
  "aiagent202501",
  "n8nuipath202507",
])
  legacy[`blog/${name}`] = summary

let redirects = 0
for (const [slug, expected] of Object.entries(legacy)) {
  for (const page of [`${slug}.html`, `${slug}/index.html`]) {
    assert.ok(files.has(page), `Missing legacy redirect: ${page}`)
    const html = await readFile(path.join(output, page), "utf8")
    const target = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/)?.[1]
    assert.ok(target, `Missing refresh on ${page}`)
    assert.equal(resolveFile(new URL(target, `${site}/${page}`)), expected)
    redirects++
  }
}

const article = await readFile(path.join(output, "notes/sap-agent-integration.html"), "utf8")
assert.match(article, /<video[^>]*controls[^>]*src="[^"]+\.mp4"/)
assert.match(article, /SAP AI Gateway/)
assert.ok(files.has("videos/sapaiquery_rfcztable_mosaic_center_speed15_endtitle.mp4"))
assert.ok(files.has("sitemap.xml"))
assert.ok(files.has("index.xml"))
assert.ok(files.has("static/contentIndex.json"))
assert.ok(![...files].some((file) => file.startsWith("archive/")))

console.log(
  `Verified ${pages.length} Quartz pages, ${links} local links/assets, ${redirects} legacy redirects and embedded video.`,
)
