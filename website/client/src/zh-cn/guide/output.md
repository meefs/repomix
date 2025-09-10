# 输出格式

Repomix 支持三种输出格式：
- XML（默认）
- Markdown
- 纯文本

## XML 格式

```bash
repomix --style xml
```

XML 格式针对 AI 处理进行了优化：

```xml
本文件是整个代码库的合并表示形式...

<file_summary>
（元数据和 AI 指令）
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// 文件内容
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

### 为什么选择 XML 作为默认格式？

Repomix 基于广泛的研究和测试，选择 XML 作为默认输出格式。这一决定基于实证证据和 AI 辅助代码分析的实际考量。

我们选择 XML 主要受到各大 AI 提供商官方推荐的影响：
- **Anthropic (Claude)**: 明确推荐使用 XML 标签来构建提示，声明"Claude 在训练过程中接触过此类提示"（[文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)）
- **Google (Gemini)**: 推荐在复杂任务中使用包括 XML 在内的结构化格式（[文档](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts)）
- **OpenAI (GPT)**: 在复杂场景中倡导结构化提示（[公告](https://x.com/OpenAIDevs/status/1890147300493914437)、[cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)）

## Markdown 格式

```bash
repomix --style markdown
```

Markdown 提供了易读的格式：

```markdown
本文件是整个代码库的合并表示形式...

# 文件概要
（元数据和 AI 指令）

# 目录结构
```
src/
index.ts
utils/
helper.ts
```

# 文件

## File: src/index.ts
```typescript
// 文件内容
```

# Git Logs

## 提交：2025-08-20 00:47:19 +0900
**消息：** feat(cli): Add --include-logs option for git commit history

**文件：**
- README.md
- src/cli/cliRun.ts
- src/core/git/gitCommand.ts
- src/core/git/gitLogHandle.ts
- src/core/output/outputGenerate.ts

## 提交：2025-08-21 00:09:43 +0900
**消息：** Merge pull request #795 from yamadashy/chore/ratchet-update-ci

**文件：**
- .github/workflows/ratchet-update.yml
```

## 在 AI 模型中的使用

每种格式都能在 AI 模型中正常工作，但需要考虑以下几点：
- 对 Claude 使用 XML（解析最准确）
- 对一般可读性使用 Markdown
- 对简单性和通用兼容性使用纯文本

## 自定义设置

在 `repomix.config.json` 中设置默认格式：
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## 纯文本格式

```bash
repomix --style plain
```

输出结构：
```text
本文件是整个代码库的合并表示形式...

================
文件概要
================
（元数据和 AI 指令）

================
目录结构
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
// 文件内容

================
Git Logs
================
================
Date: 2025-08-20 00:47:19 +0900
Message: feat(cli): Add --include-logs option for git commit history
Files:
  - README.md
  - src/cli/cliRun.ts
  - src/core/git/gitCommand.ts
  - src/core/git/gitLogHandle.ts
  - src/core/output/outputGenerate.ts
================

================
Date: 2025-08-21 00:09:43 +0900
Message: Merge pull request #795 from yamadashy/chore/ratchet-update-ci
Files:
  - .github/workflows/ratchet-update.yml
================
```
