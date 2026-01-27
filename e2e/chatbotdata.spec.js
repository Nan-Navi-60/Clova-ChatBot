import { test, expect } from '@playwright/test';
// 최신 Node.js 환경에 맞춰 import 속성 추가
import chatbotData from '../data/chatbotData.json' with { type: 'json' };

/**
 * 챗봇 데이터 기반 응답 정확도 검증 테스트
 */
test.describe('금융 챗봇 응답 시나리오 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
  });

  for (const data of chatbotData) {
    test(`[Case ${data.id}] ${data.question}`, async ({ page }) => {
      
      // 1. 소스 코드(ChatInput.jsx)에 정의된 ID(#userInput)를 사용합니다.
      const chatInput = page.locator('textarea#userInput');

      await test.step('질문을 입력하고 엔터 키를 누릅니다.', async () => {
        await chatInput.fill(data.question);
        // 버튼 클릭 대신 엔터 키 입력을 수행합니다.
        await chatInput.press('Enter');
      });

      // 2. 챗봇 답변 검증
      await test.step('챗봇의 답변이 데이터와 일치하는지 확인합니다.', async () => {
        // ChatItems.jsx의 구조인 'a.message.bot'을 사용합니다.
        const lastMessage = page.locator('a.message.bot').last();
        
        // 답변이 올 때까지 최대 10초 대기하며 텍스트 포함 여부를 체크합니다.
        await expect(lastMessage).toContainText(data.answer, { timeout: 10000 });
      });
    });
  }
});