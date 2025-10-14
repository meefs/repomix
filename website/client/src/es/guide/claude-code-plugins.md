# Plugins de Claude Code

Repomix proporciona plugins oficiales para [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) que se integran perfectamente con el entorno de desarrollo impulsado por IA. Estos plugins facilitan el análisis y empaquetado de bases de código directamente dentro de Claude Code utilizando comandos en lenguaje natural.

## Plugins Disponibles

### 1. repomix-mcp (Plugin del Servidor MCP)

Plugin fundamental que proporciona análisis de código impulsado por IA a través de la integración del servidor MCP.

**Características:**
- Empaquetar repositorios locales y remotos
- Buscar salidas empaquetadas
- Leer archivos con escaneo de seguridad integrado ([Secretlint](https://github.com/secretlint/secretlint))
- Compresión automática Tree-sitter (reducción de aproximadamente 70% de tokens)

### 2. repomix-commands (Plugin de Comandos Slash)

Proporciona comandos slash convenientes con soporte de lenguaje natural.

**Comandos Disponibles:**
- `/repomix-commands:pack-local` - Empaquetar base de código local con varias opciones
- `/repomix-commands:pack-remote` - Empaquetar y analizar repositorios remotos de GitHub

## Instalación

### 1. Agregar el Marketplace de Plugins de Repomix

Primero, agregue el marketplace de plugins de Repomix a Claude Code:

```text
/plugin marketplace add yamadashy/repomix
```

### 2. Instalar Plugins

Instale los plugins usando los siguientes comandos:

```text
# Instalar plugin del servidor MCP (base recomendada)
/plugin install repomix-mcp@repomix

# Instalar plugin de comandos (extiende la funcionalidad)
/plugin install repomix-commands@repomix
```

::: tip Relación entre Plugins
El plugin `repomix-mcp` se recomienda como base, y `repomix-commands` lo extiende con comandos slash convenientes. Aunque puede instalarlos independientemente, usar ambos proporciona la experiencia más completa.
:::

### Alternativa: Instalación Interactiva

También puede usar el instalador de plugins interactivo:

```text
/plugin
```

Esto abrirá una interfaz interactiva donde puede explorar e instalar plugins disponibles.

## Ejemplos de Uso

### Empaquetando una Base de Código Local

Use el comando `/repomix-commands:pack-local` con instrucciones en lenguaje natural:

```text
/repomix-commands:pack-local
Empaquetar este proyecto en formato Markdown con compresión
```

Otros ejemplos:
- "Empaquetar solo el directorio src"
- "Empaquetar archivos TypeScript con números de línea"
- "Generar salida en formato JSON"

### Empaquetando un Repositorio Remoto

Use el comando `/repomix-commands:pack-remote` para analizar repositorios de GitHub:

```text
/repomix-commands:pack-remote yamadashy/repomix
Empaquetar solo archivos TypeScript del repositorio yamadashy/repomix
```

Otros ejemplos:
- "Empaquetar la rama main con compresión"
- "Incluir solo archivos de documentación"
- "Empaquetar directorios específicos"

## Recursos Relacionados

- [Documentación del Servidor MCP](/guide/mcp-server) - Aprenda sobre el servidor MCP subyacente
- [Configuración](/guide/configuration) - Personalice el comportamiento de Repomix
- [Seguridad](/guide/security) - Comprenda las características de seguridad
- [Opciones de Línea de Comandos](/guide/command-line-options) - Opciones CLI disponibles

## Código Fuente de los Plugins

El código fuente de los plugins está disponible en el repositorio de Repomix:

- [Marketplace de Plugins](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [Plugin MCP](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [Plugin de Comandos](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)

## Comentarios y Soporte

Si encuentra problemas o tiene sugerencias para los plugins de Claude Code:

- [Abrir un issue en GitHub](https://github.com/yamadashy/repomix/issues)
- [Únase a nuestra comunidad de Discord](https://discord.gg/wNYzTwZFku)
- [Ver discusiones existentes](https://github.com/yamadashy/repomix/discussions)
