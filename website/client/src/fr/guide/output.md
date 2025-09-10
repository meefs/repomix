# Formats de sortie

Repomix prend en charge trois formats de sortie:
- XML (par défaut)
- Markdown
- Texte brut

## Format XML

```bash
repomix --style xml
```

Le format XML est optimisé pour le traitement par l'IA:

```xml
Ce fichier est une représentation fusionnée de toute la base de code...
<file_summary>
(Métadonnées et instructions pour l'IA)
</file_summary>
<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>
<files>
<file path="src/index.ts">
// Contenu du fichier ici
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

### Pourquoi XML comme format par défaut ?

Repomix utilise XML comme format de sortie par défaut basé sur des recherches et tests approfondis. Cette décision se fonde sur des preuves empiriques et des considérations pratiques pour l'analyse de code assistée par IA.

Notre choix de XML est principalement influencé par les recommandations officielles des principaux fournisseurs d'IA :
- **Anthropic (Claude)** : Recommande explicitement l'utilisation de balises XML pour structurer les prompts, déclarant que "Claude a été exposé à de tels prompts pendant l'entraînement" ([documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)** : Recommande les formats structurés incluant XML pour les tâches complexes ([documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)** : Préconise le prompting structuré dans les scénarios complexes ([annonce](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Format Markdown

```bash
repomix --style markdown
```

Le Markdown offre un formatage lisible:

```markdown
Ce fichier est une représentation fusionnée de toute la base de code...
# Résumé du fichier
(Métadonnées et instructions pour l'IA)
# Structure des répertoires
```
src/
index.ts
utils/
helper.ts
```
# Fichiers
## Fichier: src/index.ts
```typescript
// Contenu du fichier ici
```

# Journaux Git
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

## Utilisation avec les modèles d'IA

Chaque format fonctionne bien avec les modèles d'IA, mais considérez:
- Utilisez XML pour Claude (meilleure précision d'analyse)
- Utilisez Markdown pour une meilleure lisibilité générale
- Utilisez le texte brut pour la simplicité et une compatibilité universelle

## Personnalisation

Définissez le format par défaut dans `repomix.config.json`:

```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Format texte brut

```bash
repomix --style plain
```

Structure de sortie:

```text
Ce fichier est une représentation fusionnée de toute la base de code...
================
Résumé du fichier
================
(Métadonnées et instructions pour l'IA)
================
Structure des répertoires
================
src/
  index.ts
  utils/
    helper.ts
================
Fichiers
================
================
Fichier: src/index.ts
================
// Contenu du fichier ici

================
Journaux Git
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
