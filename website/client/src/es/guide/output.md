# Formatos de salida

Repomix admite tres formatos de salida:
- XML (predeterminado)
- Markdown
- Texto sin formato

## Formato XML

```bash
repomix --style xml
```

El formato XML está optimizado para el procesamiento de IA:

```xml
Este archivo es una representación fusionada de toda la base de código...

<file_summary>
(Metadatos e instrucciones de IA)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Contenido del archivo aquí
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

### ¿Por qué XML como formato predeterminado?

Repomix utiliza XML como formato de salida predeterminado basándose en investigaciones y pruebas extensas. Esta decisión se fundamenta en evidencia empírica y consideraciones prácticas para el análisis de código asistido por IA.

Nuestra elección de XML está principalmente influenciada por las recomendaciones oficiales de los principales proveedores de IA:
- **Anthropic (Claude)**: Recomienda explícitamente el uso de etiquetas XML para estructurar prompts, declarando que "Claude fue expuesto a tales prompts durante el entrenamiento" ([documentación](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Recomienda formatos estructurados incluyendo XML para tareas complejas ([documentación](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Aboga por el prompting estructurado en escenarios complejos ([anuncio](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Formato Markdown

```bash
repomix --style markdown
```

Markdown proporciona un formato legible:

```markdown
Este archivo es una representación fusionada de toda la base de código...

# Resumen de archivos
(Metadatos e instrucciones de IA)

# Estructura de directorios
```
src/
index.ts
utils/
helper.ts
```

# Archivos

## Archivo: src/index.ts
```typescript
// Contenido del archivo aquí
```

# Logs de Git
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

## Uso con modelos de IA

Cada formato funciona bien con modelos de IA, pero considera:
- Usar XML para Claude (mejor precisión de análisis)
- Usar Markdown para legibilidad general
- Usar texto sin formato para simplicidad y compatibilidad universal

## Personalización

Establece el formato predeterminado en `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Formato de texto sin formato

```bash
repomix --style plain
```

Estructura de salida:
```text
Este archivo es una representación fusionada de toda la base de código...

================
Resumen de archivos
================
(Metadatos e instrucciones de IA)

================
Estructura de directorios
================
src/
  index.ts
  utils/
    helper.ts

================
Archivos
================

================
Archivo: src/index.ts
================
// Contenido del archivo aquí

================
Logs de Git
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
