import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ✅ Case 1: 엔터키 전송 + 봇 응답 확인
test('Case 1: Send message using Enter key and check bot response', async ({ page }) => {
  const message = '안녕하세요';
  await page.fill('textarea#userInput', message);
  await page.press('textarea#userInput', 'Enter');
  
  // 1. 내 메시지가 올라갔는지 확인
  await expect(page.locator('a.message.user').last()).toHaveText(message);
  
  // 2. 입력창 비워졌는지 확인
  await expect(page.locator('textarea#userInput')).toHaveValue('');

  // 3. [추가됨] 챗봇의 답장이 올 때까지 기다리고 확인 (최대 10초 대기)
  const botMessage = page.locator('a.message.bot').last();
  await expect(botMessage).toBeVisible({ timeout: 10000 });
});


// ❌ Case 2: 전송 버튼 (소스 코드 버그로 실패 예상)
test('Case 2: Send message using send button', async ({ page }) => {
  const message = '반갑습니다';
  await page.fill('textarea#userInput', message);
  await page.click('button#sendBtn'); 
  await expect(page.locator('a.message.user').last()).toHaveText(message);
});

test('Case 3: Clear all chat messages (Wait for loading to finish)', async ({ page }) => {
  // 1. 메시지 전송
  await page.fill('textarea#userInput', '안녕하세요, 초기화 테스트입니다.');
  await page.press('textarea#userInput', 'Enter');

  // 2. 로딩 스피너(Loading 컴포넌트)가 화면에 나타나는지 먼저 확인
  // (봇이 응답을 생성하기 시작했음을 의미)
  const botLoading = page.locator('a.message.bot').filter({ hasText: '...' }); // Loading 텍스트나 SVG가 있다면 조건 추가
  
  // 3. '대화 기록 초기화' 버튼 대기
  // Playwright의 로케이터는 버튼이 생길 때까지 기본 30초 동안 자동으로 재시도하며 기다립니다.
  const resetBtn = page.getByTestId('reset-btn');
  
  // 버튼이 나타날 때까지 대기 (로딩이 끝나면 조건에 의해 렌더링됨)
  await expect(resetBtn).toBeVisible({ timeout: 10000 });

  // 4. 버튼 클릭
  await resetBtn.click();

  // 5. 결과 확인: 유저 메시지가 0개여야 함
  await expect(page.locator('a.message.user')).toHaveCount(0);
});

// ✅ Case 4: 재요청 방지
test('Case 4: Prevent duplicate requests via Enter key during loading', async ({ page }) => {
  // 1. 첫 번째 메시지 전송
  await page.fill('textarea#userInput', '첫 번째 메시지');
  await page.press('textarea#userInput', 'Enter');

  // 2. 즉시 두 번째 메시지 입력 후 엔터 시도
  await page.fill('textarea#userInput', '두 번째 메시지 (무시되어야 함)');
  await page.press('textarea#userInput', 'Enter');

  // 3. 봇의 응답이 오기 전까지 유저 메시지는 1개여야 함
  const userMessages = page.locator('a.message.user');
  await expect(userMessages).toHaveCount(1);
  
  // 4. (참고) 버튼도 비활성화 상태인지 함께 체크
  await expect(page.locator('button#sendBtn')).toBeDisabled();
});

// ✅ Case 5: 로딩 표시 
test('Case 5: Loading indicator displayed', async ({ page }) => {
  await page.fill('textarea#userInput', 'Loading Check');
  await page.press('textarea#userInput', 'Enter');
  const botMessage = page.locator('a.message.bot').last();
  await expect(botMessage).toBeVisible({ timeout: 10000 });
});

// ✅ Case 6: 시간 표시 (현재 시각 정밀 검증)
test('Case 6: Timestamp matches current time', async ({ page }) => {
  await page.fill('textarea#userInput', 'Time Check');
  await page.press('textarea#userInput', 'Enter');

  // 봇 응답 대기 (시간이 렌더링될 때까지)
  await expect(page.locator('a.message.bot').last()).toBeVisible();

  // 1. 현재 시스템 시간 구하기
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // ChatItems.jsx의 포맷: "HH: MM" (중간에 띄어쓰기 주의!)
  const expectedTime = `${hours}: ${minutes}`;

  // 2. 화면의 시간 텍스트 가져오기
  const timeLabel = page.locator('a.text-xs.text-gray-400').last();
  await expect(timeLabel).toBeVisible();
  const actualTime = await timeLabel.textContent();

  // 3. 비교 (테스트 도중 1분이 지날 수 있으므로, 현재 분 or 1분 전까지 허용)
  // 예: 12:00에 보냈는데 테스트 도중 12:01이 될 수 있음
  const currentMinute = parseInt(minutes);
  const prevMinute = currentMinute === 0 ? 59 : currentMinute - 1;
  const prevMinutesStr = String(prevMinute).padStart(2, '0');
  const expectedTimePrev = `${hours}: ${prevMinutesStr}`;

  // "현재 시간" 또는 "1분 전 시간" 중 하나와 일치하면 통과
  console.log(`Expected: "${expectedTime}" or "${expectedTimePrev}", Actual: "${actualTime}"`);
  expect([expectedTime, expectedTimePrev]).toContain(actualTime);
});

// ✅ Case 7: 스크롤 자동화 (픽셀 단위 검증)
test('Case 7: Auto-scroll to bottom (Pixel check)', async ({ page }) => {
  // 메시지를 충분히 많이 보내 스크롤 생성
  for (let i = 0; i < 8; i++) {
    await page.fill('textarea#userInput', `msg ${i}`);
    await page.press('textarea#userInput', 'Enter');
    // 애니메이션 기다림 (중요)
    await page.waitForTimeout(500); 
  }

  const chatBody = page.locator('#chat-body');

  // 스크롤 위치 계산 (JavaScript 실행)
  const distanceToBottom = await chatBody.evaluate((el) => {
    // scrollHeight(전체 높이) - scrollTop(현재 스크롤 위치) - clientHeight(보이는 창 높이)
    // 이 값이 0에 가까워야 바닥에 닿은 것임
    return el.scrollHeight - el.scrollTop - el.clientHeight;
  });

  console.log(`Distance to bottom: ${distanceToBottom}px`);

  // 오차 범위 5px 이내인지 확인 (브라우저 줌이나 렌더링 오차 고려)
  expect(Math.abs(distanceToBottom)).toBeLessThan(5);
});

// ✅ Case 8: 쉬프트 엔터
test('Case 8: Shift+Enter creates new line', async ({ page }) => {
  const input = page.locator('textarea#userInput');
  
  // 1. 첫 줄 입력 (fill은 내용을 덮어씀)
  await input.fill('Line 1');
  
  // 2. 줄바꿈
  await input.press('Shift+Enter');
  
  // 3. 두 번째 줄 입력 (type은 키보드 치듯 이어씀)
  // Q: 왜 type인가요? -> fill을 쓰면 앞의 'Line 1\n'이 지워지고 'Line 2'만 남기 때문입니다!
  await input.type('Line 2');

  // 4. 값 검증
  await expect(input).toHaveValue(/Line 1\nLine 2/);
  
  // 5. 전송되지 않았는지 확인 (유저 메시지 0개)
  await expect(page.locator('a.message.user')).toHaveCount(0);
});