# Plugins do Claude Code

O Repomix fornece plugins oficiais para o [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) que se integram perfeitamente ao ambiente de desenvolvimento baseado em IA. Esses plugins facilitam a análise e o empacotamento de bases de código diretamente dentro do Claude Code usando comandos em linguagem natural.

## Plugins Disponíveis

### 1. repomix-mcp (Plugin do Servidor MCP)

Plugin base que fornece análise de base de código alimentada por IA através da integração com o servidor MCP.

**Recursos:**
- Empacotar repositórios locais e remotos
- Pesquisar saídas empacotadas
- Ler arquivos com verificação de segurança integrada ([Secretlint](https://github.com/secretlint/secretlint))
- Compressão automática Tree-sitter (redução de aproximadamente 70% de tokens)

### 2. repomix-commands (Plugin de Comandos Slash)

Fornece comandos slash convenientes com suporte a linguagem natural.

**Comandos Disponíveis:**
- `/repomix-commands:pack-local` - Empacotar base de código local com várias opções
- `/repomix-commands:pack-remote` - Empacotar e analisar repositórios remotos do GitHub

## Instalação

### 1. Adicionar o Marketplace de Plugins do Repomix

Primeiro, adicione o marketplace de plugins do Repomix ao Claude Code:

```text
/plugin marketplace add yamadashy/repomix
```

### 2. Instalar Plugins

Instale os plugins usando os seguintes comandos:

```text
# Instalar plugin do servidor MCP (base recomendada)
/plugin install repomix-mcp@repomix

# Instalar plugin de comandos (estende a funcionalidade)
/plugin install repomix-commands@repomix
```

::: tip Relação entre Plugins
O plugin `repomix-mcp` é recomendado como base, e o `repomix-commands` o estende com comandos slash convenientes. Embora você possa instalá-los independentemente, usar ambos proporciona a experiência mais abrangente.
:::

### Alternativa: Instalação Interativa

Você também pode usar o instalador de plugins interativo:

```text
/plugin
```

Isso abrirá uma interface interativa onde você pode navegar e instalar plugins disponíveis.

## Exemplos de Uso

### Empacotando uma Base de Código Local

Use o comando `/repomix-commands:pack-local` com instruções em linguagem natural:

```text
/repomix-commands:pack-local
Empacotar este projeto em formato Markdown com compressão
```

Outros exemplos:
- "Empacotar apenas o diretório src"
- "Empacotar arquivos TypeScript com números de linha"
- "Gerar saída em formato JSON"

### Empacotando um Repositório Remoto

Use o comando `/repomix-commands:pack-remote` para analisar repositórios do GitHub:

```text
/repomix-commands:pack-remote yamadashy/repomix
Empacotar apenas arquivos TypeScript do repositório yamadashy/repomix
```

Outros exemplos:
- "Empacotar o branch main com compressão"
- "Incluir apenas arquivos de documentação"
- "Empacotar diretórios específicos"

## Recursos Relacionados

- [Documentação do Servidor MCP](/guide/mcp-server) - Saiba mais sobre o servidor MCP subjacente
- [Configuração](/guide/configuration) - Personalize o comportamento do Repomix
- [Segurança](/guide/security) - Entenda os recursos de segurança
- [Opções de Linha de Comando](/guide/command-line-options) - Opções CLI disponíveis

## Código-fonte dos Plugins

O código-fonte dos plugins está disponível no repositório do Repomix:

- [Marketplace de Plugins](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [Plugin MCP](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [Plugin de Comandos](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)

## Feedback e Suporte

Se você encontrar problemas ou tiver sugestões para os plugins do Claude Code:

- [Abrir um issue no GitHub](https://github.com/yamadashy/repomix/issues)
- [Junte-se à nossa comunidade no Discord](https://discord.gg/wNYzTwZFku)
- [Ver discussões existentes](https://github.com/yamadashy/repomix/discussions)
