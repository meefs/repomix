# Claude Code 플러그인

Repomix는 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)용 공식 플러그인을 제공하여 AI 기반 개발 환경과 원활하게 통합됩니다. 이 플러그인을 사용하면 자연어 명령을 사용하여 Claude Code 내에서 직접 코드베이스를 분석하고 패키징할 수 있습니다.

## 사용 가능한 플러그인

### 1. repomix-mcp (MCP 서버 플러그인)

MCP 서버 통합을 통해 AI 기반 코드베이스 분석을 제공하는 기본 플러그인입니다.

**기능:**
- 로컬 및 원격 저장소 패키징
- 패키징된 출력 검색
- 내장 보안 스캔으로 파일 읽기 ([Secretlint](https://github.com/secretlint/secretlint))
- 자동 Tree-sitter 압축 (토큰 약 70% 감소)

### 2. repomix-commands (슬래시 명령 플러그인)

자연어 지원과 함께 편리한 슬래시 명령을 제공합니다.

**사용 가능한 명령:**
- `/repomix-commands:pack-local` - 다양한 옵션으로 로컬 코드베이스 패키징
- `/repomix-commands:pack-remote` - 원격 GitHub 저장소 패키징 및 분석

## 설치

### 1. Repomix 플러그인 마켓플레이스 추가

먼저 Claude Code에 Repomix 플러그인 마켓플레이스를 추가합니다:

```text
/plugin marketplace add yamadashy/repomix
```

### 2. 플러그인 설치

다음 명령을 사용하여 플러그인을 설치합니다:

```text
# MCP 서버 플러그인 설치 (권장 기반)
/plugin install repomix-mcp@repomix

# 명령 플러그인 설치 (기능 확장)
/plugin install repomix-commands@repomix
```

::: tip 플러그인 관계
`repomix-mcp` 플러그인을 기반으로 권장하며, `repomix-commands`는 편리한 슬래시 명령으로 기능을 확장합니다. 독립적으로 설치할 수 있지만, 둘 다 사용하면 가장 포괄적인 경험을 제공합니다.
:::

### 대안: 대화형 설치

대화형 플러그인 설치 프로그램을 사용할 수도 있습니다:

```text
/plugin
```

사용 가능한 플러그인을 탐색하고 설치할 수 있는 대화형 인터페이스가 열립니다.

## 사용 예제

### 로컬 코드베이스 패키징

자연어 지침과 함께 `/repomix-commands:pack-local` 명령을 사용합니다:

```text
/repomix-commands:pack-local
이 프로젝트를 Markdown 형식으로 압축하여 패키징
```

기타 예제:
- "src 디렉토리만 패키징"
- "TypeScript 파일을 행 번호와 함께 패키징"
- "JSON 형식으로 출력 생성"

### 원격 저장소 패키징

`/repomix-commands:pack-remote` 명령을 사용하여 GitHub 저장소를 분석합니다:

```text
/repomix-commands:pack-remote yamadashy/repomix
yamadashy/repomix 저장소에서 TypeScript 파일만 패키징
```

기타 예제:
- "main 브랜치를 압축하여 패키징"
- "문서 파일만 포함"
- "특정 디렉토리 패키징"

## 관련 리소스

- [MCP 서버 문서](/guide/mcp-server) - 기본 MCP 서버에 대해 알아보기
- [구성](/guide/configuration) - Repomix 동작 사용자 지정
- [보안](/guide/security) - 보안 기능 이해
- [명령줄 옵션](/guide/command-line-options) - 사용 가능한 CLI 옵션

## 플러그인 소스 코드

플러그인 소스 코드는 Repomix 저장소에서 확인할 수 있습니다:

- [플러그인 마켓플레이스](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [MCP 플러그인](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [명령 플러그인](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)

## 피드백 및 지원

Claude Code 플러그인에 대한 문제가 발생하거나 제안이 있는 경우:

- [GitHub에서 이슈 열기](https://github.com/yamadashy/repomix/issues)
- [Discord 커뮤니티 가입](https://discord.gg/wNYzTwZFku)
- [기존 토론 보기](https://github.com/yamadashy/repomix/discussions)
