# 出力フォーマット

Repomixは3つの出力フォーマットをサポートしています。
- XML（デフォルト）
- Markdown
- プレーンテキスト

## XMLフォーマット

```bash
repomix --style xml
```

XMLフォーマットはAI処理に最適化されています。

```xml
このファイルは、コードベース全体を1つのドキュメントにまとめた表現です...

<file_summary>
（メタデータとAI向けの使用説明）
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.js">
// ファイルの内容がここに表示されます
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

<instruction>
（output.instructionFilePathで指定されたカスタム指示）
</instruction>
```

### なぜXMLをデフォルト形式としているのか？

Repomixは広範な研究とテストに基づき、XMLをデフォルトの出力形式として採用しています。この決定は実証的な証拠とAIアシスト型コード解析における実用性を考慮した結果です。

XML採用の主な理由は、大手AIプロバイダーからの公式推奨事項にあります：
- **Anthropic (Claude)**: プロンプト構造化においてXMLタグの使用を明示的に推奨し、「Claudeは学習過程でそのようなプロンプトに触れている」と明記（[ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)）
- **Google (Gemini)**: 複雑なタスクにおいてXMLを含む構造化フォーマットを推奨（[ドキュメント](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts)）
- **OpenAI (GPT)**: 複雑なシナリオでの構造化プロンプトを推奨（[発表](https://x.com/OpenAIDevs/status/1890147300493914437)、[cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)）

## Markdownフォーマット

```bash
repomix --style markdown
```

Markdownは読みやすいフォーマットを提供します。

```markdown
このファイルは、コードベース全体を1つのドキュメントにまとめた表現です...

# ファイルサマリー
（メタデータとAI向けの使用説明）

# ディレクトリ構造
```
src/
index.ts
utils/
helper.ts
```

# ファイル

## File: src/index.ts
```typescript
// ファイルの内容がここに表示されます
```

# Gitログ

## コミット: 2025-08-20 00:47:19 +0900
**メッセージ:** feat(cli): Add --include-logs option for git commit history

**ファイル:**
- README.md
- src/cli/cliRun.ts
- src/core/git/gitCommand.ts
- src/core/git/gitLogHandle.ts
- src/core/output/outputGenerate.ts

## コミット: 2025-08-21 00:09:43 +0900
**メッセージ:** Merge pull request #795 from yamadashy/chore/ratchet-update-ci

**ファイル:**
- .github/workflows/ratchet-update.yml
```

## AIモデルとの使用

各フォーマットはAIモデルで問題なく動作しますが、以下の点を考慮してください。
- XMLはClaude用に最適化（最も正確な解析）
- Markdownは一般的な読みやすさを重視
- プレーンテキストはシンプルさと互換性を重視

## カスタマイズ

`repomix.config.json`でデフォルトのフォーマットを設定
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## プレーンテキストフォーマット

```bash
repomix --style plain
```

出力の構造
```text
このファイルは、コードベース全体を1つのドキュメントにまとめた表現です...

================
ファイルサマリー
================
（メタデータとAI向けの使用説明）

================
ディレクトリ構造
================
src/
  index.ts
  utils/
    helper.ts

================
ファイル
================

================
File: src/index.js
================
// ファイルの内容がここに表示されます

================
File: src/utils.js
================
// ファイルの内容がここに表示されます

================
Gitログ
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
