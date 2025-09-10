# Output Formats

Repomix supports three output formats:
- XML (default)
- Markdown
- Plain Text 

## XML Format

```bash
repomix --style xml
```

XML format is optimized for AI processing:

```xml
This file is a merged representation of the entire codebase...

<file_summary>
(Metadata and AI instructions)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// File contents here
</file>
</files>

<git_logs>
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
</git_logs>
```

### Why XML as Default Format?
Repomix uses XML as the default output format based on extensive research and testing. This decision is grounded in both empirical evidence and practical considerations for AI-assisted code analysis.

Our choice of XML is primarily influenced by official recommendations from major AI providers:
- **Anthropic (Claude)**: Explicitly recommends XML tags for structuring prompts, stating that "Claude was exposed to such prompts during training" ([source](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Recommends structured formats including XML for complex tasks ([documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Advocates for structured prompting in complex scenarios ([announcement](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))


## Markdown Format

```bash
repomix --style markdown
```

Markdown provides readable formatting:

```markdown
This file is a merged representation of the entire codebase...

# File Summary
(Metadata and AI instructions)

# Directory Structure
```
src/
index.ts
utils/
helper.ts
```

# Files

## File: src/index.ts
```typescript
// File contents here
```

# Git Logs
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

## Usage with AI Models

Each format works well with AI models, but consider:
- Use XML for Claude (best parsing accuracy)
- Use Markdown for general readability
- Use Plain Text for simplicity and universal compatibility

## Customization

Set default format in `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Plain Text Format

```bash
repomix --style plain
```

Output structure:
```text
This file is a merged representation of the entire codebase...

================
File Summary
================
(Metadata and AI instructions)

================
Directory Structure
================
src/
  index.ts
  utils/
    helper.ts

================
Files
================

================
File: src/index.ts
================
// File contents here

================
Git Logs
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
