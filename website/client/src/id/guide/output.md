# Format Output

Repomix mendukung tiga format output:
- XML (default)
- Markdown
- Plain Text 

## Format XML

```bash
repomix --style xml
```

Format XML dioptimalkan untuk pemrosesan AI:

```xml
Ini adalah representasi gabungan dari seluruh codebase...

<file_summary>
(Metadata dan instruksi AI)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Konten file di sini
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

### Mengapa XML sebagai Format Default?

Repomix menggunakan XML sebagai format output default berdasarkan penelitian dan pengujian yang ekstensif. Keputusan ini didasarkan pada bukti empiris dan pertimbangan praktis untuk analisis kode yang dibantu AI.

Pilihan kami terhadap XML terutama dipengaruhi oleh rekomendasi resmi dari penyedia AI utama:
- **Anthropic (Claude)**: Secara eksplisit merekomendasikan penggunaan tag XML untuk menyusun prompt, menyatakan bahwa "Claude terekspos pada prompt semacam itu selama pelatihan" ([dokumentasi](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Merekomendasikan format terstruktur termasuk XML untuk tugas kompleks ([dokumentasi](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Menganjurkan prompting terstruktur dalam skenario kompleks ([pengumuman](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Format Markdown

```bash
repomix --style markdown
```

Markdown menyediakan format yang mudah dibaca:

```markdown
Ini adalah representasi gabungan dari seluruh codebase...

# File Summary
(Metadata dan instruksi AI)

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
// Konten file di sini
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

## Penggunaan dengan Model AI

Setiap format bekerja dengan baik dengan model AI, tetapi pertimbangkan:
- Gunakan XML untuk Claude (akurasi parsing terbaik)
- Gunakan Markdown untuk keterbacaan umum
- Gunakan Plain Text untuk kesederhanaan dan kompatibilitas universal

## Kustomisasi

Atur format default di `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Format Plain Text

```bash
repomix --style plain
```

Struktur output:
```text
Ini adalah representasi gabungan dari seluruh codebase...

================
File Summary
================
(Metadata dan instruksi AI)

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
// Konten file di sini

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

