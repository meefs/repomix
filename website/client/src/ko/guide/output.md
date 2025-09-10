# 출력 형식

Repomix는 세 가지 출력 형식을 지원합니다:
- XML (기본값)
- Markdown
- 일반 텍스트

## XML 형식

```bash
repomix --style xml
```

XML 형식은 AI 처리에 최적화되어 있습니다:

```xml
이 파일은 전체 코드베이스를 하나의 문서로 통합한 것입니다...

<file_summary>
(메타데이터 및 AI 지시사항)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// 파일 내용
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

### 왜 XML을 기본 형식으로 사용하나요?

Repomix는 광범위한 연구와 테스트를 바탕으로 XML을 기본 출력 형식으로 채택했습니다. 이 결정은 실증적 증거와 AI 보조 코드 분석의 실용적 고려사항에 근거합니다.

XML 채택의 주요 이유는 주요 AI 제공업체의 공식 권장사항에 있습니다:
- **Anthropic (Claude)**: 프롬프트 구조화에서 XML 태그 사용을 명시적으로 권장하며, "Claude는 훈련 과정에서 그러한 프롬프트에 노출되었다"고 명시 ([문서](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: 복잡한 작업에서 XML을 포함한 구조화된 형식을 권장 ([문서](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: 복잡한 시나리오에서 구조화된 프롬프팅을 권장 ([발표](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Markdown 형식

```bash
repomix --style markdown
```

Markdown은 읽기 쉬운 형식을 제공합니다:

```markdown
이 파일은 전체 코드베이스를 하나의 문서로 통합한 것입니다...

# 파일 요약
(메타데이터 및 AI 지시사항)

# 디렉토리 구조
```
src/
index.ts
utils/
helper.ts
```

# 파일

## File: src/index.ts
```typescript
// 파일 내용
```

# Git 로그

## 커밋: 2025-08-20 00:47:19 +0900
**메시지:** feat(cli): Add --include-logs option for git commit history

**파일:**
- README.md
- src/cli/cliRun.ts
- src/core/git/gitCommand.ts
- src/core/git/gitLogHandle.ts
- src/core/output/outputGenerate.ts

## 커밋: 2025-08-21 00:09:43 +0900
**메시지:** Merge pull request #795 from yamadashy/chore/ratchet-update-ci

**파일:**
- .github/workflows/ratchet-update.yml
```

## AI 모델과의 사용

각 형식은 AI 모델에서 잘 작동하지만, 다음 사항을 고려하세요:
- Claude에는 XML 사용 (가장 정확한 파싱)
- 일반적인 가독성을 위해서는 Markdown
- 단순성과 호환성을 위해서는 일반 텍스트

## 사용자 정의

`repomix.config.json`에서 기본 형식 설정:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## 일반 텍스트 형식

```bash
repomix --style plain
```

출력 구조:
```text
이 파일은 전체 코드베이스를 하나의 문서로 통합한 것입니다...

================
파일 요약
================
(메타데이터 및 AI 지시사항)

================
디렉토리 구조
================
src/
  index.ts
  utils/
    helper.ts

================
파일
================

================
File: src/index.ts
================
// 파일 내용

================
Git 로그
================
================
Date: 2025-08-20 00:47:19 +0900
Message: feat(cli): Add --include-logs option for git commit history
Files:
  - README.md
  - src/cli/cliRun.ts
  - src/core/git/gitCommand.ts
  - src/core/git/gitLogHandle.ts
  - src/core/output/outputGenerate.ts
================

================
Date: 2025-08-21 00:09:43 +0900
Message: Merge pull request #795 from yamadashy/chore/ratchet-update-ci
Files:
  - .github/workflows/ratchet-update.yml
================
```
