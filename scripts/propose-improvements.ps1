# PowerShell 스크립트
# 사용법: .\scripts\propose-improvements.ps1 -testFile e2e/YOUR_TEST_FILE.spec.js

[CmdletBinding()]
param (
    [Parameter(Mandatory=$true)]
    [string]$testFile
)
# 1. 한글 출력 깨짐 방지 (세미나 콘솔 가독성 향상)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# .env 파일 로드 (SLACK_WEBHOOK_URL 등 다른 변수를 위해 유지)
$dotenvPath = Join-Path -Path $PSScriptRoot -ChildPath "..\.env"
if (Test-Path -Path $dotenvPath) {
    # 단순화를 위해 .env 파싱 로직은 생략하고, CI 환경 등에서 직접 변수 설정을 권장
}

# test-results.json 파일 내용을 읽어옵니다.
$testResultsPath = Join-Path -Path $PSScriptRoot -ChildPath "..\test-results.json"
$testResultsContent = Get-Content -Raw -Path $testResultsPath

# 개선 제안을 받을 테스트 파일 내용을 읽어옵니다.
$testFileContent = Get-Content -Raw -Path (Join-Path -Path $PSScriptRoot -ChildPath "..\$testFile")

# Gemini에게 보낼 프롬프트 내용을 정의합니다.
$prompt = @"
제미나이야, 아래 제공된 `test-results.json` 파일 내용과 `$testFile` 파일 내용을 분석해서 내 테스트 코드에 대한 개선점을 제안해 줘. 

**1. 분석 대상 테스트 결과 파일 (`test-results.json` 내용):**
```json
$testResultsContent
```

**2. 개선 제안을 받을 테스트 파일 (`$testFile` 내용):**
```javascript
$testFileContent
```

**3. 중점적으로 검토할 항목:**
*   가독성: 테스트 케이스의 이름과 코드가 다른 개발자가 이해하기 쉽게 작성되었는지 검토해 줘.
*   유지보수성: 테스트 데이터(질문, 예상 답변 등)가 코드 내에 하드코딩 되어 있다면, 별도의 파일(e.g., JSON)로 분리하여 관리하는 방법을 제안해 줘.
*   안정성: 테스트가 실행 환경에 따라 불안정하게 실패할 가능성은 없는지, 더 안정적인 Locator(선택자) 전략이 있다면 알려줘.
*   Playwright 모범 사례: 현재 코드가 Playwright 라이브러리의 최신 모범 사례에 부합하는지 검토하고, 개선할 부분이 있다면 제안해 줘.

위 항목들을 바탕으로, `$testFile` 파일의 코드를 어떻게 개선할 수 있을지 구체적인 코드 예시와 함께 한국어로 설명해 줘.
"@

# .result-text 폴더 생성
$reportDir = Join-Path -Path $PSScriptRoot -ChildPath "..\.result-text"
if (-not (Test-Path -Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}
$outputFile = Join-Path -Path $reportDir -ChildPath "ai_suggestions.txt"


# 정의된 프롬프트를 사용하여 Gemini CLI를 호출하고 결과를 파일에 저장
# 경고: 이 명령어는 내부적으로 불안정하여 AI 제안을 성공적으로 받아오지 못할 수 있습니다.
Write-Output "AI 제안 생성 중... (이전과 동일한 오류가 발생할 수 있습니다)"
$prompt | npx @google/gemini-cli ask --output-format "text"| Out-File -FilePath $outputFile -Encoding utf8 
#$prompt | npx @google/gemini-cli ask --output-format "text" | Tee-Object -FilePath $outputFile
#| Out-File -FilePath $outputFile -Encoding utf8

#npx @google/gemini-cli ask --model "gemini-1.5-flash" --output-format "text" $prompt
Write-Output "AI 제안 생성이 완료되었습니다. .result-text/ai_suggestions.txt 파일을 확인하세요."
