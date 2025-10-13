---
description: Pack and analyze a remote GitHub repository
---

Fetch and analyze a GitHub repository using Repomix.

When the user asks to pack a remote repository, analyze their request and run the appropriate repomix command.

## User Intent Examples

The user might ask in various ways:
- "Pack the yamadashy/repomix repository"
- "Analyze facebook/react from GitHub"
- "Pack https://github.com/microsoft/vscode"
- "Pack react repository with compression"
- "Pack only TypeScript files from the Next.js repo"
- "Analyze the main branch of user/repo"

## Your Responsibilities

1. **Understand the user's intent** from natural language
2. **Extract the repository information**:
   - Repository URL or owner/repo format
   - Specific branch, tag, or commit (if mentioned)
3. **Determine the appropriate options**:
   - Output format: xml (default), markdown, json, or plain
   - Whether to compress (for large codebases)
   - File patterns to include/ignore
   - Additional features (copy to clipboard)
4. **Execute the command** with: `npx repomix@latest --remote <repo> [options]`

## Supported Repository Formats

- `owner/repo` (e.g., yamadashy/repomix)
- `https://github.com/owner/repo`
- `https://github.com/owner/repo/tree/branch-name`
- `https://github.com/owner/repo/commit/hash`

## Available Options

- `--style <format>`: Output format (xml, markdown, json, plain)
- `--include <patterns>`: Include only matching patterns (e.g., "src/**/*.ts,**/*.md")
- `--ignore <patterns>`: Additional ignore patterns
- `--compress`: Enable Tree-sitter compression (~70% token reduction)
- `--output <path>`: Custom output path
- `--copy`: Copy output to clipboard

## Command Examples

Based on user intent, you might run:

```bash
# "Pack yamadashy/repomix"
npx repomix@latest --remote yamadashy/repomix

# "Analyze facebook/react"
npx repomix@latest --remote https://github.com/facebook/react

# "Pack the develop branch of user/repo"
npx repomix@latest --remote https://github.com/user/repo/tree/develop

# "Pack microsoft/vscode with compression"
npx repomix@latest --remote microsoft/vscode --compress

# "Pack only TypeScript files from owner/repo"
npx repomix@latest --remote owner/repo --include "src/**/*.ts"

# "Pack yamadashy/repomix as markdown and copy to clipboard"
npx repomix@latest --remote yamadashy/repomix --copy --style markdown
```

## Help and Documentation

If you need more information about available options or encounter any issues:
- Run `npx repomix@latest -h` or `npx repomix@latest --help` to see all available options
- Check the official documentation at https://github.com/yamadashy/repomix

Remember: Parse the user's natural language request and translate it into the appropriate repomix command with the --remote option.
