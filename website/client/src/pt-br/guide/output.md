# Formatos de Saída

O Repomix suporta três formatos de saída:
- XML (padrão)
- Markdown
- Texto simples 

## Formato XML

```bash
repomix --style xml
```

O formato XML é otimizado para processamento por IA:

```xml
Este arquivo é uma representação consolidada de toda a base de código...

<file_summary>
(Metadados e instruções para IA)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Conteúdo do arquivo aqui
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

### Por que XML como formato padrão?

O Repomix usa XML como formato de saída padrão com base em pesquisas e testes extensivos. Esta decisão é fundamentada em evidências empíricas e considerações práticas para análise de código assistida por IA.

Nossa escolha do XML é principalmente influenciada por recomendações oficiais dos principais provedores de IA:
- **Anthropic (Claude)**: Recomenda explicitamente o uso de tags XML para estruturar prompts, afirmando que "Claude foi exposto a tais prompts durante o treinamento" ([documentação](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Recomenda formatos estruturados incluindo XML para tarefas complexas ([documentação](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Defende o uso de prompting estruturado em cenários complexos ([anúncio](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Formato Markdown

```bash
repomix --style markdown
```

O Markdown oferece formatação legível:

```markdown
Este arquivo é uma representação consolidada de toda a base de código...

# Resumo do Arquivo
(Metadados e instruções para IA)

# Estrutura de Diretórios
```
src/
index.ts
utils/
helper.ts
```

# Arquivos

## Arquivo: src/index.ts
```typescript
// Conteúdo do arquivo aqui
```

# Logs do Git
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

## Uso com Modelos de IA

Cada formato funciona bem com modelos de IA, mas considere:
- Use XML para Claude (melhor precisão de análise)
- Use Markdown para leitura geral
- Use Texto Simples para simplicidade e compatibilidade universal

## Customização

Defina o formato padrão no `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Formato de Texto Simples

```bash
repomix --style plain
```

Estrutura de saída:
```text
Este arquivo é uma representação consolidada de toda a base de código...

================
Resumo do Arquivo
================
(Metadados e instruções para IA)

================
Estrutura de Diretórios
================
src/
  index.ts
  utils/
    helper.ts

================
Arquivos
================

================
Arquivo: src/index.ts
================
// Conteúdo do arquivo aqui

================
Logs do Git
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
