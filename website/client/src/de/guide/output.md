# Ausgabeformate

Repomix unterstützt drei Ausgabeformate:
- XML (Standard)
- Markdown
- Klartext

## XML-Format

```bash
repomix --style xml
```

Das XML-Format ist für die KI-Verarbeitung optimiert:

```xml
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

<file_summary>
(Metadaten und KI-Anweisungen)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Dateiinhalt hier
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

### Warum XML als Standardformat?

Repomix verwendet XML als Standard-Ausgabeformat basierend auf umfangreichen Forschungen und Tests. Diese Entscheidung gründet auf empirischen Belegen und praktischen Überlegungen für KI-unterstützte Codeanalyse.

Unsere Wahl von XML wird hauptsächlich von offiziellen Empfehlungen großer KI-Anbieter beeinflusst:
- **Anthropic (Claude)**: Empfiehlt explizit die Verwendung von XML-Tags zur Strukturierung von Prompts und erklärt, dass "Claude während des Trainings solchen Prompts ausgesetzt war" ([Dokumentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Empfiehlt strukturierte Formate einschließlich XML für komplexe Aufgaben ([Dokumentation](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Befürwortet strukturiertes Prompting in komplexen Szenarien ([Ankündigung](https://x.com/OpenAIDevs/status/1890147300493914437), [Cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Markdown-Format

```bash
repomix --style markdown
```

Markdown bietet lesbare Formatierung:

```markdown
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

# Dateizusammenfassung
(Metadaten und KI-Anweisungen)

# Verzeichnisstruktur
```text
src/
  index.ts
  utils/
    helper.ts
```

# Dateien

## Datei: src/index.ts
```typescript
// Dateiinhalt hier
```

# Git-Logs
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

## Klartext-Format

```bash
repomix --style plain
```

Ausgabestruktur:
```text
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

================
Dateizusammenfassung
================
(Metadaten und KI-Anweisungen)

================
Verzeichnisstruktur
================
src/
  index.ts
  utils/
    helper.ts

================
Dateien
================

================
Datei: src/index.ts
================
// Dateiinhalt hier

================
Git-Logs
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
