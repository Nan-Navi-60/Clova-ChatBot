# 🤖 Agentic Frontend Test Automation
> **AI 에이전트(Gemini)가 주도하는 프론트엔드 QA 및 유지보수 자동화 솔루션**

## 🌟 Project Overview
본 프로젝트는 **Gemini CLI**를 단순한 보조 도구가 아닌 독립적인 **'SDET 에이전트'**로 설계하여, 테스트 코드 작성부터 결과 분석, 리팩토링 제안까지 수행하는 **Closed-loop** 시스템을 구현했습니다.

## 🏗 System Architecture
AI 에이전트가 프로젝트 구조를 파악하고 스스로 테스트를 수행하는 지능형 워크플로우를 가집니다.
![5](https://github.com/user-attachments/assets/e6080961-221b-4611-8679-f302a9ef4a51)
![6](https://github.com/user-attachments/assets/b515f7bb-0b87-45a9-bd6f-ff7a0a85598f)


1. **분석**: `Gemini-CLI`가 코드 구조 파악
2. **생성**: 기능별 데이터 라벨링(`data-testid`) 감지 및 테스트 코드 작성
3. **실행**: `Playwright` 기반 자동 테스트 수행
4. **개선**: 결과 분석 후 코드 수정안 및 리팩토링 방안 제안

### 기술 스택
| 분류 | 기술 |
| :--- | :--- |
| **Framework** | `React` |
| **Testing Tool** | `Playwright` |
| **AI Model** | `Gemini 2.5 Flash` (Gemini-CLI) |

## 🚀 Key Features
- **금융 챗봇 E2E 테스트**: 비동기 API 통신 및 데이터 유효성 검증
- **지능형 리포팅**: 테스트 결과를 Slack API를 통해 자동 전송
- **Self-Healing**: 테스트 실패 시 AI가 원인을 분석하여 즉각적인 수정 대안 제시

## Chatbot Project Introduction

본 자동화 시스템의 성능을 검증하기 위해 금융 챗봇 프로젝트를 예시 타겟으로 선정했습니다.

![AI를 활용한 프론트엔드 테스트 자동화](https://github.com/user-attachments/assets/90c508c2-3975-4f8f-805e-bfef9c698274)

![AI를 활용한 프론트엔드 테스트 자동화 (1)](https://github.com/user-attachments/assets/9b80fcbc-4be3-46df-9684-a03ca406894b)

💡 Note: 커스텀 프로젝트 적용 가능 본 레포지토리는 금융 챗봇을 예시로 가이드하고 있지만, 사용자의 개별 프론트엔드 프로젝트에도 동일하게 적용할 수 있습니다. data-testid 태그 설정과 Gemini CLI 프롬프트 수정을 통해 어떤 React 프로젝트든 자동화 테스트 환경 구축이 가능합니다.


## 📺 Demo
### Playwright 시연
![6  시연영상](https://github.com/user-attachments/assets/651a8302-4eb8-4bd7-b6ce-beba876b73da)
### Slack 알림 결과
![AI를 활용한 프론트엔드 테스트 자동화](https://github.com/user-attachments/assets/3631068c-5514-461a-9781-85f96b4cf874)

## 💻 Getting Started
### 환경 세팅 (.env)
```bash
CLOVACHAT={APIGW_Invoke_URL}
CLIENT_SECRET={SECRET_KEY}
SLACK_WEBHOOK_URL={your_slack_webhook_url}
```

### 실행 가이드
```bash
# 1. 서버 및 클라이언트 실행
node server.js
npm run dev

# 2. 테스트 자동화 및 리포트 생성
npm run test-and-report

# 3. AI 개선 제안 확인
npm run propose-improvements
```
