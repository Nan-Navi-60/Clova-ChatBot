const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { generateSummaryAndSuggestions } = require('./analyze-test-results.cjs');

// .env 파일 로드 (절대 경로)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function runTestsAndSendReportToSlack() {
  console.log('🚀 테스트 실행 및 이미지 스타일 리포트 생성 중...');

  // 1. 테스트 실행 및 결과 파일(JSON) 생성
  try {
    execSync('npx playwright test --reporter=json', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ 일부 테스트 실패. 상세 리포트를 구성합니다.');
  }

  // 2. test-results.json 읽기
  const resultsPath = path.join(process.cwd(), 'test-results.json');
  if (!fs.existsSync(resultsPath)) {
    console.error('❌ test-results.json 파일을 찾을 수 없습니다.');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const attachments = [];

  // 3. 각 테스트 케이스를 순회하며 개별 카드(Attachment) 생성
  results.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        const result = test.results[0];
        const isPassed = result.status === 'passed';
        
        // 이미지 스타일의 개별 카드 구성
        attachments.push({
          color: isPassed ? "#2EB67D" : "#E01E5A", // 성공(초록), 실패(빨강)
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${isPassed ? '✅' : '❌'} *${spec.title}*`
              }
            },
            {
              type: "section",
              fields: [
                { type: "mrkdwn", text: `*결과*\n${isPassed ? '성공' : '실패'}` },
                { type: "mrkdwn", text: `*실행 시간*\n${(result.duration / 1000).toFixed(2)}초` },
                { type: "mrkdwn", text: `*환경*\nlocal-alpha` },
                { type: "mrkdwn", text: `*실행 시각*\n${new Date(result.startTime).toLocaleString('ko-KR')}` },
                { type: "mrkdwn", text: `*현재 티켓*\ndefault` },
                { type: "mrkdwn", text: `*테스트 UserNo*\n12345678` }
              ]
            }
          ]
        });
      });
    });
  });

  // 4. AI 종합 분석 결과 추가 (마지막 카드)
  const reportContent = generateSummaryAndSuggestions();
  if (reportContent) {
    attachments.push({
      color: "#36C5F0", // AI 분석용 파란색 바
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: "🤖 *AI 종합 개선 제안*" }
        },
        ...reportContent.blockReport
      ]
    });
  }

  // 5. 슬랙 전송
  if (SLACK_WEBHOOK_URL) {
    console.log(`📤 총 ${attachments.length}개의 리포트 카드를 전송합니다...`);
    try {
      await axios.post(SLACK_WEBHOOK_URL, { attachments });
      console.log('✅ 슬랙 전송 완료!');
    } catch (err) {
      console.error('❌ 슬랙 전송 실패:', err.message);
    }
  }

  // 콘솔 기록용
  console.log('\n[분석 결과 요약]');
  if (reportContent) console.log(reportContent.textReport);
}

runTestsAndSendReportToSlack();