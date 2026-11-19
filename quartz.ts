import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import type { ExplorerOptions } from "@quartz-community/explorer"

// Explorer serializes this callback for the browser, so keep its ordering data inside it.
const sortExplorer: NonNullable<ExplorerOptions["sortFn"]> = (a, b) => {
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1

  const order = [
    "notes/sap-agent-integration",
    "notes/sap-mcp-poc",
    "notes/automation-journey-2021-2025",
  ]
  const aIndex = order.indexOf(a.slugSegments?.join("/") ?? "")
  const bIndex = order.indexOf(b.slugSegments?.join("/") ?? "")
  const aRank = aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex
  const bRank = bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex
  if (aRank !== bRank) return aRank - bRank

  return (a.displayName ?? "").localeCompare(b.displayName ?? "", undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

componentRegistry.setOptionOverrides("@quartz-community/explorer", { sortFn: sortExplorer })

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
