const fs = require('fs');
const path = require('path');

const resultsFilePath = path.join(process.cwd(), 'test-results.json');

function generateSummaryAndSuggestions() {
  if (!fs.existsSync(resultsFilePath)) return null;

  try {
    const rawData = fs.readFileSync(resultsFilePath, 'utf8');
    const results = JSON.parse(rawData);

    const resultsByFile = {};
    let overallTotal = 0, overallPassed = 0, overallFailed = 0;

    // 중첩된 테스트 구조를 끝까지 파고드는 재귀 함수
    function walkSuite(suite, fileData) {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            fileData.total++;
            overallTotal++;
            const lastResult = test.results[test.results.length - 1];
            const status = lastResult ? lastResult.status : 'unknown';

            if (status === 'passed') {
              fileData.passed++;
              overallPassed++;
            } else {
              fileData.failed++;
              overallFailed++;
              fileData.failures.push({
                title: spec.title,
                error: lastResult.errors?.[0]?.message || 'No error'
              });
            }
          });
        });
      }
      // 하위 스위트(describe 블록 등)가 있다면 다시 탐색
      if (suite.suites) {
        suite.suites.forEach(sub => walkSuite(sub, fileData));
      }
    }

    results.suites.forEach(suite => {
      const fileName = suite.file || 'Unknown File';
      if (!resultsByFile[fileName]) {
        resultsByFile[fileName] = { total: 0, passed: 0, failed: 0, failures: [] };
      }
      walkSuite(suite, resultsByFile[fileName]);
    });

    // 텍스트 리포트 생성
    const statusEmoji = overallFailed > 0 ? '❌' : '✅';
    let textReport = `${statusEmoji} Playwright UI 자동화 테스트 결과\n\n`;
    textReport += `📊 전체 요약: 총 ${overallTotal}개 TC\n• 성공: ${overallPassed} | 실패: ${overallFailed}\n\n`;

    // 슬랙 블록 킷 리포트 생성
    const blockReport = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} Playwright UI 자동화 테스트 결과`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📊 전체 요약*\n총 ${overallTotal}개` },
          { type: 'mrkdwn', text: `*✅ 성공*\n${overallPassed}개` },
          { type: 'mrkdwn', text: `*❌ 실패*\n${overallFailed}개` },
        ],
      },
      { type: 'divider' },
    ];

    Object.keys(resultsByFile).forEach(file => {
      const stats = resultsByFile[file];
      const fileSummaryText = `${stats.failed > 0 ? '🔺' : '🔹'} *${file}*\n  └  총 ${stats.total}개 중 ${stats.passed}개 성공\n`;
      textReport += fileSummaryText.replace(/\*/g, ''); // 텍스트 파일에서는 마크다운 제거

      blockReport.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${stats.failed > 0 ? '🔺' : '🔹'} *${file}*  (${stats.passed}/${stats.total} 성공)`,
        },
      });

      if (stats.failed > 0) {
        const failureTitles = stats.failures.map(f => f.title).join(', ');
        textReport += `  ⚠️ 실패 건: ${failureTitles}\n`;
        
        const failureDetails = stats.failures.map(f => `> • ${f.title}`).join('\n');
        blockReport.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*실패한 테스트:*\n${failureDetails}`,
          },
        });
      }
      textReport += '\n';
    });

    return { blockReport, textReport };
  } catch (err) {
    return `❌ 리포트 생성 실패: ${err.message}`;
  }
}

module.exports = { generateSummaryAndSuggestions };