---
description: Pack local codebase with Repomix
---

Pack a local codebase using Repomix with AI-optimized format.

When the user asks to pack a local codebase, analyze their request and run the appropriate repomix command.

## User Intent Examples

The user might ask in various ways:
- "Pack this codebase"
- "Pack the src directory"
- "Pack this project as markdown"
- "Pack TypeScript files only"
- "Pack with compression and copy to clipboard"
- "Pack this project including git history"

## Your Responsibilities

1. **Understand the user's intent** from natural language
2. **Determine the appropriate options**:
   - Which directory to pack (default: current directory)
   - Output format: xml (default), markdown, json, or plain
   - Whether to compress (for large codebases)
   - File patterns to include/ignore
   - Additional features (copy to clipboard, include git diffs/logs)
3. **Execute the command** with: `npx repomix@latest [directory] [options]`

## Available Options

- `--style <format>`: Output format (xml, markdown, json, plain)
- `--include <patterns>`: Include only matching patterns (e.g., "src/**/*.ts,**/*.md")
- `--ignore <patterns>`: Additional ignore patterns
- `--compress`: Enable Tree-sitter compression (~70% token reduction)
- `--output <path>`: Custom output path
- `--copy`: Copy output to clipboard
- `--include-diffs`: Include git diff output
- `--include-logs`: Include git commit history

## Command Examples

Based on user intent, you might run:

```bash
# "Pack this codebase"
npx repomix@latest

# "Pack the src directory"
npx repomix@latest src/

# "Pack as markdown with compression"
npx repomix@latest --style markdown --compress

# "Pack only TypeScript and Markdown files"
npx repomix@latest --include "src/**/*.ts,**/*.md"

# "Pack and copy to clipboard"
npx repomix@latest --copy

# "Pack with git history"
npx repomix@latest --include-diffs --include-logs
```

## Help and Documentation

If you need more information about available options or encounter any issues:
- Run `npx repomix@latest -h` or `npx repomix@latest --help` to see all available options
- Check the official documentation at https://github.com/yamadashy/repomix

Remember: Parse the user's natural language request and translate it into the appropriate repomix command.
