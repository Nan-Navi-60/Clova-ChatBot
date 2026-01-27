// scripts/analyze-test-results.cjs
const fs = require('fs');
const path = require('path');

const resultsFilePath = path.join(process.cwd(), 'test-results.json');

function generateSummaryAndSuggestions() {
  if (!fs.existsSync(resultsFilePath)) {
    console.error('❌ test-results.json 파일을 찾을 수 없습니다.');
    return null;
  }

  try {
    const rawData = fs.readFileSync(resultsFilePath, 'utf8');
    const results = JSON.parse(rawData);

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failureDetails = [];

    // JSON 구조 순회
    results.suites.forEach(suite => {
      suite.specs.forEach(spec => {
        spec.tests.forEach(test => {
          totalTests++;
          
          // [핵심 수정] test.status 대신 실제 실행 결과(results 배열)를 확인해야 함
          // results 배열의 마지막 실행 결과가 최종 상태임
          const lastResult = test.results[test.results.length - 1];
          const status = lastResult ? lastResult.status : 'unknown';

          if (status === 'passed') {
            passedTests++;
          } else {
            failedTests++;
            // 에러 메시지 수집
            const errors = lastResult.errors ? lastResult.errors.map(err => err.message).join('\n') : 'No error message';
            failureDetails.push({
              title: spec.title,
              errors: errors
            });
          }
        });
      });
    });

    // 슬랙 메시지 생성
    const statusEmoji = failedTests > 0 ? '❌' : '✅';
    let report = `${statusEmoji} *Playwright UI 자동화 테스트 결과*\n\n`;
    report += `📊 *요약*\n• 전체: ${totalTests} | 성공: ${passedTests} | 실패: ${failedTests}\n\n`;

    if (failedTests > 0) {
      report += `🔍 *실패 상세*\n`;
      failureDetails.forEach(detail => {
        report += `- *${detail.title}*\n\`\`\`${detail.errors.substring(0, 100)}...\`\`\`\n`;
      });
    } else {
      report += `🎉 모든 테스트를 통과했습니다!`;
    }

    return report;

  } catch (err) {
    console.error('❌ 리포트 생성 중 에러:', err.message);
    return `❌ 리포트 생성 실패: ${err.message}`;
  }
}

module.exports = { generateSummaryAndSuggestions };