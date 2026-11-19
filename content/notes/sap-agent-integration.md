---
title: "AI Agent＋SAP：從 MCP 請購單到 RFC 網關整合"
date: 2026-11-18T12:00:00+08:00
lastmod: 2026-11-19T12:00:00+08:00
draft: false
description: "透過 SAP 官方 SDK、SAP AI Gateway 與 Claude／Codex，以自然語言探索 RFC、ZTABLE 與 SAP 資料。"
summary: "完成 SAP RFC 與網關整合驗證，結合自然語言查詢、RFC 探索及 ZTABLE 檢視，降低使用者、IT 與 SAP 開發人員的操作負擔。"
tags: ["SAP", "MCP", "RFC", "BAPI", "Python"]
aliases:
  - blog/sapagent202611
  - blog/sapagent202611/index
---

AI Agent 要處理 SAP 業務，需要能找到適合的函數、理解欄位，並取得可驗證的執行結果。2026 年的工作從 [MCP 請購單 POC](/notes/sap-mcp-poc)，延伸到通用 RFC 網關整合。

## 已完成的整合與驗證

截至 2026/11/18，完成以下實測工作：

- **連線基礎**：以 uv 管理 Python 3.11、固定 PyRFC 版本及 SDK 載入設定；直接 SAP RFC 登入、ping 與 `STFC_CONNECTION` 回傳驗證通過。
- **RFC 網關整合**：建立安裝、啟動與驗證流程。`/health`、`/ready` 及通用 `/api/rfc` 驗證通過。
- **SAP 能力探索**：在指定名稱範圍查得 603 筆 RFC／BAPI 目錄結果，確認包含請購與採購相關函數；查得 55 個符合條件的自訂透明表。
- **欄位與資料理解**：取得一張訂單交接表的 12 個欄位、DDIC 說明及複合主鍵，完成 100 筆樣本讀取與本機匯出。

我的成果集中在環境建置、網關整合、驗證與 SAP 查詢。目錄搜尋的 603 筆是指定範圍結果，100 筆樣本未指定排序，皆不能視為全系統盤點或最新資料。

## 用自然語言打開 SAP 查詢與整合

SAP 主機可能部署在 Unix／Linux 等伺服器環境。從 Windows 串接 SAP，往往需要處理專用介面、連線設定與權限，對一般使用者或剛接手的 IT 人員都有門檻。

這套架構結合 **SAP 官方 SDK、SAP AI Gateway，以及 Claude 或 Codex**，讓自然語言需求透過網關轉成 SAP 查詢：

```text
使用者 → Claude／Codex → SAP AI Gateway → SAP 官方 SDK → SAP
```

最大的好處，是讓不同角色都能更容易理解與使用 SAP：

- **一般使用者／新人**：用人類的自然語言進行 SAP 查詢，降低學習交易碼與查詢介面的負擔。可透過既有授權與權限規劃提供查詢服務；是否需要額外帳號或費用，仍依 SAP 授權條款確認。
- **進階 IT 人員**：探索可用的 RFC、檢視自訂 ZTABLE 的結構與資料，掌握外接系統整合所需的介面與資料依據，減少接手時摸索的時間。
- **SAP 開發人員**：用自然語言輔助查找函數、欄位與資料，減少反覆切換、輸入 t-code 的負擔。每天敲交易碼的心累，終於有機會少一點！

## 操作示範：自然語言查詢 RFC 與 ZTABLE

![](../videos/sapAIquery_rfcZtable_mosaic_center_speed15_endtitle.mp4)

## 下一步：從工具可用走向業務可交付

本次驗證建立了 Agent 探索 SAP 與讀取資料的基礎。請購單建立及修改未在這次測試中執行；原有 PR API 當次尚未啟動，其健康檢查仍待重跑。

後續將優先處理舊版介面相容、業務欄位及狀態碼確認，再驗證寫入流程的授權、核准、交易回傳與重複執行控制。通用 RFC 網關的 `/api/rfc` 與既有 PR API 的 `/pr/create` 是不同契約，串接前必須明確對應。

本文依 2026/11/18 的實測工作紀錄整理，呈現當次驗證成果。
