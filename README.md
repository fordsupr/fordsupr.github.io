# Jason Li｜AI Agent × SAP

網站：https://fordsupr.github.io/

使用 [Quartz](https://github.com/jackyzha0/quartz) **v5.1.0** 的官方 **Default** 模板，保留官方 CSS、頁面框架、搜尋、導覽、圖譜與深色模式。站名、語系、網址及聯絡連結在 `quartz.config.yaml` 設定；沒有自訂 CSS 或 HTML 模板。

## 開發與建置

使用 Node.js 24（本機 `.node-version` 為 24.19.0）與 npm 10.9.2 以上。

```powershell
npm ci
npx quartz plugin install
npx quartz build --serve
```

預覽：http://localhost:8080。正式建置與驗證時執行 `npm run build:site`。

建置後驗證：

```powershell
node scripts/verify-site.mjs
```

## 內容

- `content/index.md`：首頁，`content/get-in-touch.md`：聯絡方式。
- `content/profile.md`、`content/resume.md`：介紹與履歷。
- `content/notes/`：SAP Agent 最新成果、MCP POC 與歷年摘要。
- `content/videos/`、`content/images/`：影片及圖片，隨 Quartz 一起發布。

文章以標準 Markdown 連結，影片使用 Quartz 官方支援的 Markdown 嵌入。舊 `/blog/.../`、`/about/` 與 `/search/` 網址透過官方 AliasRedirects 插件保留；aliases 同時列出無尾斜線與 `/index` 形式，支援 GitHub Pages 舊目錄式網址。

`scripts/preserve-asset-urls.mjs` 在建置後補留原始圖片／影片路徑，避免 Quartz 小寫化資源網址後，既有連結失效。

## GitHub Pages 部署

`quartz-source` 儲存 Quartz 原始碼，`main` 儲存產生的網站檔案，兩個分支保留此前網站的 Git 歷史。GitHub Pages Source 為 **Deploy from a branch → main → /(root)**。

```powershell
git push origin quartz-source
npm run deploy
```

`npm run deploy` 自動建置、保留素材網址、驗證內容，再透過隔離的 Git worktree 更新並推送 `main`。使用一般推送，保留遠端歷史。

目前登入憑證有 repo 權限，缺少 workflow 權限，因此採用分支發布；取得 workflow 權限後，可依 Quartz 官方 Hosting 文件改用 GitHub Actions。

`public/`、`node_modules/`、`.quartz/` 不納入版本控制。`archive/` 與原始 `MP4/` 僅保留本機，不推送或發布。

## 遷移與上游

2026-11-19 從 Hugo 遷移。先前 Hugo 原始碼與內容已保存在 `archive/hugo-2026-11-19/`；早期 13 篇原稿仍在 `archive/pre-2026/`。

上游來源：`https://github.com/jackyzha0/quartz`，分支 `v5`，基準 commit `7cfb0796165c848be5438117e9806802123bf676`。官方框架與樣式保持原樣；MIT 授權保存在 `LICENSE.txt`。

更新框架前，先比對上游發布紀錄，在本機完成建置與驗證後再推送。請保留站台內容、設定與部署腳本。
