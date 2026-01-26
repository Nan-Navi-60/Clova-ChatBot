const { execSync } = require('child_process');
const path = require('path');
const axios = require('axios');
const { generateSummaryAndSuggestions } = require('./analyze-test-results.cjs');

// .env 파일 로드
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function runTestsAndSendReportToSlack() {
  if (!SLACK_WEBHOOK_URL) {
    console.error('❌ 에러: .env 파일에 SLACK_WEBHOOK_URL이 설정되지 않았습니다.');
    return;
  }

  console.log('🚀 Playwright 테스트 실행 중...');
  try {
    // npx playwright test 실행
    execSync('npx playwright test', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ 테스트 중 일부 실패가 감지되었습니다. 리포트를 생성합니다.');
  }

  const reportContent = generateSummaryAndSuggestions();
  
  if (!reportContent) {
    console.error('❌ 리포트 생성 실패.');
    return;
  }

  console.log('📤 슬랙으로 리포트 전송 중...');
  try {
    await axios.post(SLACK_WEBHOOK_URL, { text: reportContent });
    console.log('✅ 슬랙 전송 완료!');
  } catch (err) {
    console.error('❌ 슬랙 전송 에러:', err.message);
  }
}

runTestsAndSendReportToSlack();