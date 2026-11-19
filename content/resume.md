---
title: "Jason Li｜AI Agent × SAP 整合履歷"
date: 2026-11-19T00:00:00+08:00
draft: false
description: "20 年以上企業系統與 SAP 經驗，聚焦 AI Agent、MCP 工具整合、RFC／BAPI 與企業流程自動化。"
summary: "以 SAP FI／AM 與跨系統整合經驗為基礎，實作 MCP 請購單 POC、SAP RFC 網關整合、企業 RAG 與流程自動化。"
tags: ["AI Agent", "SAP", "MCP", "RAG"]
aliases:
  - blog/resume
  - blog/resume/index
---

## 專業定位

**AI Agent／SAP Integration Engineer**。具 20 年以上企業系統與 SAP 相關經驗，專長為 FI／AM、ABAP 及跨系統整合，近年聚焦 MCP 工具、RFC／BAPI、企業 RAG 與自動化工作流程。

能將業務需求拆成可執行的流程，串接主檔查詢、文件檢索與 SAP 操作，並以連線驗證、欄位語意及異常處理支撐交付。目標角色為企業 AI Agent 應用開發、SAP 智慧自動化及系統整合；可承接專案合作。

## 代表專案

### SAP RFC 網關與 Agent 整合基礎｜2026/11

- 建立 SAP 整合環境，以 uv 管理 Python 3.11、PyRFC 與 SAP SDK 載入設定。
- 完成 RFC 網關整合，建立安裝、啟動及驗證流程；完成 RFC 登入、ping、網關就緒與呼叫回傳驗證。
- 探索指定範圍內 603 筆 RFC／BAPI 與 55 個自訂透明表，取得訂單交接表欄位定義及資料樣本。
- 診斷舊 SAP 缺少 RFC_READ_TABLE 參數的相容性問題，改用通用 RFC 介面成功查詢。

成果為整合與查詢驗證；自動相容降級及業務寫入流程仍待開發／驗證。[專案成果](/notes/sap-agent-integration)

### SAP MCP 請購單 POC｜2026/03

- 以 FastMCP 封裝既有 FastAPI／PyRFC 服務，設計自然語言串接 SAP 請購單的工具流程。
- 串接申請人、歷史請購單、成本中心、採購組與物料群組查詢，支援依歷史範例、逐欄補齊或結構化資料建立請購單的情境。
- 分離 MCP 與 SAP 連線環境，保留既有 API 契約；專案維持概念驗證定位。

[POC 說明](/notes/sap-mcp-poc)

### 企業 RAG 與 SAP／MES 自動化｜2021–2025

- 實作 CSV 語意檢索與本地 RAG 文件問答，累積內部部署、來源引用及 API 串接經驗。
- 結合 UiPath、Python 與 OCR 完成 SAP 訂單、寄銷數據更新及清帳相關機器人；以 n8n 探索任務編排。
- 依使用單位專案簡報：MES 交期預估每人每月節省 11 小時、ISO 文管每人每月節省 6 小時；A、B 廠生產排程各每日節省 125 分鐘。

[歷年實作摘要](/notes/automation-journey-2021-2025)

## 核心能力

| 領域          | 實作能力                                                                   |
| ------------- | -------------------------------------------------------------------------- |
| AI Agent 整合 | MCP／FastMCP、工具流程拆分、API 串接、n8n 任務編排                         |
| SAP           | FI／AM、FICO 支援、ABAP 報表、RFC／BAPI、DDIC 欄位探索、SAP／MES／BPM 整合 |
| 企業 AI       | RAG、本地文件問答 API、句向量語意檢索、OCR API                             |
| 開發與自動化  | Python、FastAPI、PyRFC、Polars／Parquet、UiPath、Java／JSP、Git、uv        |

## 工作經歷

**KINIK COMPANY｜2021/03–至今**  
SAP／HANA／FI 支援與 ABAP 報表開發；串接 SCM 付款及 BPM 費用申請流程，推動 MES、業務與 HR 自動化。參與清大產學合作規格推薦系統，使用 XGBoost、Random Forest；近年延伸企業文件問答與 AI Agent＋SAP 整合實作。

**EXCELLENCE OPTO. INC.｜2019/08–2020/11**  
SAP FI／CO／AM 支援，參與美國、德國、西班牙及中國子公司 roll-out 與關鍵使用者訓練。

**Landseed International Hospital｜2019/03–2019/07**  
SAP FICO／MM 支援，涵蓋醫療物料與倉儲管理。

**CHUNGHWA PICTURE TUBES｜2006/01–2019/03**  
SAP FI／AM 支援；開發供應商採購查詢、預算／費用 Web API 與資產保管系統，參與 2018 年電子發票導入，累積財務、採購及資產流程整合經驗。

**Century 21｜2002/09–2004/11**  
Java／JSP、Oracle 與房地產管理網站開發。

## 學歷與聯絡

中原大學｜企業管理碩士，1999 年完成。

[Email](mailto:fordsupr@gmail.com)｜[GitHub](https://github.com/fordsupr)｜[LinkedIn](https://www.linkedin.com/in/jason-li-i3bigdata)
