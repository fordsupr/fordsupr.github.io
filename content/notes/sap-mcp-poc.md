---
title: "SAP MCP 請購單 POC：把業務需求串成工具流程"
date: 2026-03-15T09:00:00+08:00
lastmod: 2026-11-19T12:00:00+08:00
draft: false
description: "以 FastMCP 串接既有 SAP 請購單 API，結合主檔及歷史資料查詢，探索自然語言操作 SAP。"
summary: "將既有 FastAPI／PyRFC 請購單服務封裝為 MCP 工具，讓客戶端串接申請人、主檔與歷史資料，再提交 SAP 請購需求。"
tags: ["SAP", "MCP", "FastMCP", "Python"]
aliases:
  - blog/sapmcp202603
  - blog/sapmcp202603/index
---

這個 POC 探索如何把自然語言需求串接到 SAP 請購流程：Agent 透過 MCP 查詢申請人、歷史請購單與主檔代碼，再呼叫既有 SAP API。

## 架構與工具

```text
MCP Client → FastMCP → FastAPI → PyRFC → SAP ECC
                 ↘ Polars／Parquet 主檔與歷史資料查詢
```

MCP 層使用 Python 3.11，SAP 連線沿用既有 Python 3.8 環境，以 HTTP 隔離相依套件。當時的客戶端連接設計包含本機 stdio 與區域網路 SSE。

| 工具               | 用途                                         |
| ------------------ | -------------------------------------------- |
| search_requester   | 依姓名查申請人工號                           |
| get_pr_history     | 查歷史請購單範例                             |
| search_cost_center | 查成本中心                                   |
| search_pur_group   | 查採購組                                     |
| search_matl_group  | 查物料群組                                   |
| pr_create_pr       | 呼叫既有 /pr/create API，串接 BAPI_PR_CREATE |

## 三種業務情境

1. **參考歷史資料**：確認申請人，再查歷史請購單作為欄位範例。
2. **逐欄位補齊**：依需求查詢成本中心、採購組及物料群組，整理請購資料。
3. **結構化輸入**：使用者提供 JSON 或表格，交給建立請購單工具。

歷史範例可以減少填寫負擔；主檔代碼、日期、金額及缺漏欄位仍需依業務規則確認。工具串接也需要處理 BAPI 訊息、交易提交與失敗回傳，才能驗證整筆業務是否完成。

## POC 定位與後續

這篇記錄工具流程與架構設計，尚未提供完整生產驗收、成功率或節省工時數字。重點是將對話、資料查詢與 SAP 執行分層，讓既有 SAP API 能被 MCP 客戶端使用。

2026 年 11 月進一步完成 [SAP RFC 網關整合驗證](/notes/sap-agent-integration)。新的通用網關採 Python 3.11 整合環境，與本 POC 的既有 PR API 分開；兩者的端點契約不可直接互換。

PyRFC 及 SDK 設定需依實際環境版本處理。近期做法是固定套件版本並設定專案的 SDK DLL 載入路徑；相關背景見 [歷年實作摘要](/notes/automation-journey-2021-2025)。
