const fs = require('fs');
const path = require('path');

const resultsFilePath = path.join(process.cwd(), 'test-results.json');

function generateSummaryAndSuggestions() {
  if (!fs.existsSync(resultsFilePath)) {
    console.log('test-results.json not found. Please run Playwright tests first.');
    return null;
  }

  const rawData = fs.readFileSync(resultsFilePath, 'utf8');
  const results = JSON.parse(rawData);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureDetails = [];

  for (const suite of results.suites) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        totalTests++;
        if (test.status === 'passed') {
          passedTests++;
        } else {
          failedTests++;
          const errors = test.errors.map(error => error.message).join('\n');
          const testTitle = spec.title;
          let suggestion = 'Review the test output and relevant component logic for the failed assertion.';

          if (testTitle.includes('Enter key')) {
            if (errors.includes("expected input to have value ''")) {
              suggestion = "Suggestion: 입력창이 비워지지 않았습니다. `ChatInput.jsx`에서 엔터 입력 후 `setInput(\"\")` 로직을 확인하세요.";
            }
          } else if (testTitle.includes('Send button')) {
            if (errors.includes("expected input to have value ''")) {
              suggestion = "Suggestion: 전송 버튼 클릭 후 입력창 초기화 로직이 누락되었는지 확인하세요.";
            }
          }

          failureDetails.push({
            title: testTitle,
            status: test.status,
            errors: errors,
            suggestion: suggestion
          });
        }
      }
    }
  }

  let report = `### 🤖 Playwright 테스트 리포트\n\n`;
  report += `**전체 테스트:** ${totalTests}\n`;
  report += `**성공:** ${passedTests}\n`;
  report += `**실패:** ${failedTests}\n\n`;

  if (failedTests > 0) {
    report += `### ❌ 실패 상세 내용:\n`;
    failureDetails.forEach(detail => {
      report += `---\n`;
      report += `#### 테스트명: ${detail.title}\n`;
      report += `**에러 메시지:**\n\`\`\`\n${detail.errors}\n\`\`\`\n`;
      report += `**🛠️ AI 수정 제안:**\n${detail.suggestion}\n`;
    });
  } else {
    report += `모든 테스트가 성공했습니다! 🎉\n`;
  }

  return report;
}

// 다른 파일에서 쓸 수 있게 내보내기
module.exports = { generateSummaryAndSuggestions };