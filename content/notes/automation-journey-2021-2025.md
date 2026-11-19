---
title: "從 SAP 自動化到 AI Agent：2021–2025 實作摘要"
date: 2025-12-31T12:00:00+08:00
lastmod: 2026-11-19T12:00:00+08:00
draft: false
description: "濃縮 13 篇實作筆記：SAP 整合、RPA 效益、企業 RAG 與 AI Agent 工作流程。"
summary: "從 SAP／MES 自動化、Python RFC 與企業文件問答，到 n8n＋UiPath 任務編排，整理 2021–2025 年的實作成果與設計心得。"
tags: ["SAP", "Python", "RPA", "RAG", "n8n", "UiPath"]
aliases:
  - blog/ai-agent-sap-journey-2021-2025
  - blog/ai-agent-sap-journey-2021-2025/index
  - blog/helloworld
  - blog/helloworld/index
  - blog/sap_erp
  - blog/sap_erp/index
  - blog/rpa
  - blog/rpa/index
  - blog/pyrfc
  - blog/pyrfc/index
  - blog/pywithrpa
  - blog/pywithrpa/index
  - blog/pyrfc_over512
  - blog/pyrfc_over512/index
  - blog/poetry
  - blog/poetry/index
  - blog/qabot
  - blog/qabot/index
  - blog/rpa2023
  - blog/rpa2023/index
  - blog/llamaqa
  - blog/llamaqa/index
  - blog/rpa2024q4
  - blog/rpa2024q4/index
  - blog/aiagent202501
  - blog/aiagent202501/index
  - blog/n8nuipath202507
  - blog/n8nuipath202507/index
---

我的實作主軸逐步從 SAP 與桌面自動化，延伸到企業文件問答及 AI Agent 工作流程。這篇整理 2021–2025 年的 13 篇技術文章，保留成果、限制與可延續的經驗。

## SAP 整合：先讓資料與操作可靠

早期以 Java、Python 與 SAP VM 環境累積整合經驗，再透過 PyRFC 串接 SAP。實務重點是 Python、PyRFC 與 SAP NetWeaver RFC SDK 的版本及 DLL 載入相容性；桌面操作則以 Python UI Automation 補足既有系統介面。

遇到傳統 `RFC_READ_TABLE` 的 512 長度資料列限制時，採分欄查詢再合併。合併應帶入完整主鍵並核對資料一致性，避免依列順序拼接。這些整合經驗，也是後續將 SAP 能力封裝成 Agent 工具的基礎。

## RPA 成果：以使用單位節省工時衡量

2021–2023 年專案集中在 SAP、MES 與文管流程。以下數字來自原文引用的使用單位專案簡報，保留各自計算單位：

| 專案              | 原文記錄效益         |
| ----------------- | -------------------- |
| MES 交期預估      | 每人每月節省 11 小時 |
| ISO 文管自動刪除  | 每人每月節省 6 小時  |
| A 廠 MES 生產排程 | 每日節省 125 分鐘    |
| B 廠 MES 生產排程 | 每日節省 125 分鐘    |

導入時先確認 SOP、需求窗口與排程，再處理分支及異常。2025 年初已完成 SAP 訂單上傳、寄銷數據更新及清帳相關機器人，涵蓋 `VL01N`、`VF01`、`F-04`。

## 企業問答：從語意檢索走向 RAG

2023 年以句向量模型將 CSV 問題轉成向量，依相似度取回既有答案。這是語意檢索，當時未使用 LLM，也沒有進行模型微調。

2024 年進一步以 API 實作本地文件問答，以內部部署與來源引用為方向。RAG（Retrieval-Augmented Generation，檢索增強生成）讓回答結合文件內容；要投入企業流程，還需要驗證檢索品質、回答依據與存取範圍。

## AI Agent 工作流程：把任務拆成可維護的步驟

2025 年的設計轉向混合流程：n8n 負責編排，UiPath 執行桌面任務，Python 串接 API；LLM／OCR 處理文字與影像，再交由規則或人員確認。

PaddleOCR 客製化與 API 封裝已完成。原文記錄中英數辨識約 97%、英數約 99%，但未列測試集規模，因此只能視為當時測試結果。辨識錯字及關鍵欄位仍需校驗，不能推論為所有文件皆可全自動處理。

當時規劃以 AI 組件改善異常判斷，並安排教育訓練與上線；原文未提供後續驗收紀錄。可延續的原則是：**讓 Agent 理解需求與選擇工具，讓明確的介面、規則與人員承接執行及例外處理。**

後續實作：[SAP MCP 請購單 POC](/notes/sap-mcp-poc)｜[2026 SAP Agent 整合成果](/notes/sap-agent-integration)｜[AI Agent＋SAP 履歷](/resume)。
