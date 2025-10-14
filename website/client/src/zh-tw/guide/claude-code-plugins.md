# Claude Code 外掛

Repomix 為 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) 提供官方外掛，可與 AI 驅動的開發環境無縫整合。這些外掛讓您可以使用自然語言指令直接在 Claude Code 中分析和打包程式碼庫。

## 可用外掛

### 1. repomix-mcp（MCP 伺服器外掛）

透過 MCP 伺服器整合提供 AI 驅動的程式碼庫分析的基礎外掛。

**功能：**
- 打包本地和遠端儲存庫
- 搜尋打包輸出
- 使用內建安全掃描讀取檔案（[Secretlint](https://github.com/secretlint/secretlint)）
- 自動 Tree-sitter 壓縮（減少約 70% 的 token）

### 2. repomix-commands（斜線指令外掛）

提供支援自然語言的便利斜線指令。

**可用指令：**
- `/repomix-commands:pack-local` - 使用各種選項打包本地程式碼庫
- `/repomix-commands:pack-remote` - 打包和分析遠端 GitHub 儲存庫

## 安裝

### 1. 新增 Repomix 外掛市集

首先，將 Repomix 外掛市集新增到 Claude Code：

```text
/plugin marketplace add yamadashy/repomix
```

### 2. 安裝外掛

使用以下指令安裝外掛：

```text
# 安裝 MCP 伺服器外掛（建議基礎）
/plugin install repomix-mcp@repomix

# 安裝指令外掛（擴充功能）
/plugin install repomix-commands@repomix
```

::: tip 外掛關係
建議將 `repomix-mcp` 外掛作為基礎，`repomix-commands` 透過便利的斜線指令擴充功能。雖然可以獨立安裝，但同時使用兩者可獲得最全面的體驗。
:::

### 替代方案：互動式安裝

您也可以使用互動式外掛安裝程式：

```text
/plugin
```

這將開啟一個互動式介面，您可以瀏覽並安裝可用的外掛。

## 使用範例

### 打包本地程式碼庫

使用 `/repomix-commands:pack-local` 指令搭配自然語言指示：

```text
/repomix-commands:pack-local
將此專案打包為 Markdown 格式並壓縮
```

其他範例：
- "僅打包 src 目錄"
- "打包 TypeScript 檔案並新增行號"
- "產生 JSON 格式的輸出"

### 打包遠端儲存庫

使用 `/repomix-commands:pack-remote` 指令分析 GitHub 儲存庫：

```text
/repomix-commands:pack-remote yamadashy/repomix
僅打包 yamadashy/repomix 儲存庫中的 TypeScript 檔案
```

其他範例：
- "壓縮打包 main 分支"
- "僅包含文件檔案"
- "打包特定目錄"

## 相關資源

- [MCP 伺服器文件](/guide/mcp-server) - 瞭解底層 MCP 伺服器
- [設定](/guide/configuration) - 自訂 Repomix 行為
- [安全性](/guide/security) - 瞭解安全功能
- [命令列選項](/guide/command-line-options) - 可用的 CLI 選項

## 外掛原始碼

外掛原始碼可在 Repomix 儲存庫中找到：

- [外掛市集](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [MCP 外掛](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [指令外掛](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)

## 意見回饋和支援

如果您遇到問題或對 Claude Code 外掛有建議：

- [在 GitHub 上提交 issue](https://github.com/yamadashy/repomix/issues)
- [加入我們的 Discord 社群](https://discord.gg/wNYzTwZFku)
- [檢視現有討論](https://github.com/yamadashy/repomix/discussions)
