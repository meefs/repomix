# Plugins Claude Code

Repomix fournit des plugins officiels pour [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) qui s'intègrent parfaitement à l'environnement de développement alimenté par l'IA. Ces plugins facilitent l'analyse et l'empaquetage de bases de code directement dans Claude Code en utilisant des commandes en langage naturel.

## Plugins Disponibles

### 1. repomix-mcp (Plugin Serveur MCP)

Plugin de base qui fournit une analyse de code alimentée par l'IA via l'intégration du serveur MCP.

**Fonctionnalités :**
- Empaqueter des dépôts locaux et distants
- Rechercher dans les sorties empaquetées
- Lire des fichiers avec analyse de sécurité intégrée ([Secretlint](https://github.com/secretlint/secretlint))
- Compression Tree-sitter automatique (réduction d'environ 70% des tokens)

### 2. repomix-commands (Plugin Commandes Slash)

Fournit des commandes slash pratiques avec support du langage naturel.

**Commandes Disponibles :**
- `/repomix-commands:pack-local` - Empaqueter une base de code locale avec diverses options
- `/repomix-commands:pack-remote` - Empaqueter et analyser des dépôts GitHub distants

## Installation

### 1. Ajouter le Marketplace de Plugins Repomix

Tout d'abord, ajoutez le marketplace de plugins Repomix à Claude Code :

```text
/plugin marketplace add yamadashy/repomix
```

### 2. Installer les Plugins

Installez les plugins en utilisant les commandes suivantes :

```text
# Installer le plugin serveur MCP (base recommandée)
/plugin install repomix-mcp@repomix

# Installer le plugin de commandes (étend les fonctionnalités)
/plugin install repomix-commands@repomix
```

::: tip Relations entre Plugins
Le plugin `repomix-mcp` est recommandé comme base, et `repomix-commands` l'étend avec des commandes slash pratiques. Bien que vous puissiez les installer indépendamment, utiliser les deux offre l'expérience la plus complète.
:::

### Alternative : Installation Interactive

Vous pouvez également utiliser l'installateur de plugins interactif :

```text
/plugin
```

Cela ouvrira une interface interactive où vous pourrez parcourir et installer les plugins disponibles.

## Exemples d'Utilisation

### Empaquetage d'une Base de Code Locale

Utilisez la commande `/repomix-commands:pack-local` avec des instructions en langage naturel :

```text
/repomix-commands:pack-local
Empaqueter ce projet au format Markdown avec compression
```

Autres exemples :
- "Empaqueter uniquement le répertoire src"
- "Empaqueter les fichiers TypeScript avec numéros de ligne"
- "Générer la sortie au format JSON"

### Empaquetage d'un Dépôt Distant

Utilisez la commande `/repomix-commands:pack-remote` pour analyser des dépôts GitHub :

```text
/repomix-commands:pack-remote yamadashy/repomix
Empaqueter uniquement les fichiers TypeScript du dépôt yamadashy/repomix
```

Autres exemples :
- "Empaqueter la branche main avec compression"
- "Inclure uniquement les fichiers de documentation"
- "Empaqueter des répertoires spécifiques"

## Ressources Connexes

- [Documentation du Serveur MCP](/guide/mcp-server) - En savoir plus sur le serveur MCP sous-jacent
- [Configuration](/guide/configuration) - Personnaliser le comportement de Repomix
- [Sécurité](/guide/security) - Comprendre les fonctionnalités de sécurité
- [Options de Ligne de Commande](/guide/command-line-options) - Options CLI disponibles

## Code Source des Plugins

Le code source des plugins est disponible dans le dépôt Repomix :

- [Marketplace de Plugins](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [Plugin MCP](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [Plugin de Commandes](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)

## Retours et Support

Si vous rencontrez des problèmes ou avez des suggestions pour les plugins Claude Code :

- [Ouvrir une issue sur GitHub](https://github.com/yamadashy/repomix/issues)
- [Rejoindre notre communauté Discord](https://discord.gg/wNYzTwZFku)
- [Voir les discussions existantes](https://github.com/yamadashy/repomix/discussions)
