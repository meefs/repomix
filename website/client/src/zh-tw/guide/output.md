# 輸出格式

Repomix 支援三種輸出格式：
- XML（預設）
- Markdown
- 純文字

## XML 格式

```bash
repomix --style xml
```

XML 格式針對 AI 處理進行了優化：

```xml
本文件是整個程式碼庫的合併表示形式...

<file_summary>
（元數據和 AI 指令）
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// 文件內容
</file>
</files>

<git_logs>
<git_log_commit>
<date>2025-08-20 00:47:19 +0900</date>
<message>feat(cli): Add --include-logs option for git commit history</message>
<files>
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts
</files>
</git_log_commit>
<git_log_commit>
<date>2025-08-21 00:09:43 +0900</date>
<message>Merge pull request #795 from yamadashy/chore/ratchet-update-ci</message>
<files>
.github/workflows/ratchet-update.yml
</files>
</git_log_commit>
</git_logs>
```

### 為什麼選擇 XML 作為預設格式？

Repomix 基於廣泛的研究和測試，選擇 XML 作為預設輸出格式。這一決定基於實證證據和 AI 輔助程式碼分析的實際考量。

我們選擇 XML 主要受到各大 AI 提供商官方推薦的影響：
- **Anthropic (Claude)**: 明確推薦使用 XML 標籤來構建提示，聲明「Claude 在訓練過程中接觸過此類提示」（[文檔](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)）
- **Google (Gemini)**: 推薦在複雜任務中使用包括 XML 在內的結構化格式（[文檔](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts)）
- **OpenAI (GPT)**: 在複雜場景中倡導結構化提示（[公告](https://x.com/OpenAIDevs/status/1890147300493914437)、[cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)）

## Markdown 格式

```bash
repomix --style markdown
```

Markdown 提供了易讀的格式：

```markdown
本文件是整個程式碼庫的合併表示形式...

# 文件概要
（元數據和 AI 指令）

# 目錄結構
```
src/
index.ts
utils/
helper.ts
```

# 文件

## File: src/index.ts
```typescript
// 文件內容
```

# Git 記錄
```
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
```

## 在 AI 模型中的使用

每種格式都能在 AI 模型中正常工作，但需要考慮以下幾點：
- 對 Claude 使用 XML（解析最準確）
- 對一般可讀性使用 Markdown
- 對簡單性和通用兼容性使用純文字

## 自定義設置

在 `repomix.config.json` 中設置預設格式：
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## 純文字格式

```bash
repomix --style plain
```

輸出結構：
```text
本文件是整個程式碼庫的合併表示形式...

================
文件概要
================
（元數據和 AI 指令）

================
目錄結構
================
src/
  index.ts
  utils/
    helper.ts

================
文件
================

================
File: src/index.ts
================
// 文件內容

================
Git 記錄
================
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
