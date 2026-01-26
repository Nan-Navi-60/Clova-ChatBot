import os
import requests
import google.generativeai as genai
import sys

# 1. 설정 (환경변수나 하드코딩된 값)
GEMINI_API_KEY = "AIzaSyCmWuYqE0q_PxcUg8z_Dh_DSii6diF-uw8"
SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"

# Gemini 설정
genai.configure(api_key=GEMINI_API_KEY)

def analyze_logs(log_content):
    """Gemini에게 로그 분석 요청"""
    model = genai.GenerativeModel('gemini-2.5-flash') # 빠르고 저렴한 모델 추천
    
    prompt = f"""
    너는 QA 엔지니어링 팀의 AI 어시스턴트야.
    아래는 프론트엔드 테스트 자동화 실행 로그야.
    
    이 로그를 보고 다음 형식으로 슬랙 메시지를 작성해줘:
    1. **요약**: 전체 성공/실패 여부와 통과한 테스트 수.
    2. **실패 원인**: (실패가 있다면) 어떤 테스트가 왜 실패했는지 간단히 분석.
    3. **제안**: 해결을 위해 확인해야 할 코드 부분 제안.
    
    [로그 내용 시작]
    {log_content}
    [로그 내용 끝]
    """
    
    response = model.generate_content(prompt)
    return response.text

def send_slack_message(message):
    """슬랙으로 메시지 전송"""
    payload = {"text": message}
    response = requests.post(SLACK_WEBHOOK_URL, json=payload)
    if response.status_code == 200:
        print("✅ 슬랙 전송 완료!")
    else:
        print(f"❌ 슬랙 전송 실패: {response.text}")

if __name__ == "__main__":
    # 터미널에서 실행 시 로그 파일을 인자로 받음
    if len(sys.argv) < 2:
        print("사용법: python report_agent.py <로그파일경로>")
        sys.exit(1)
        
    log_file_path = sys.argv[1]
    
    with open(log_file_path, 'r', encoding='utf-8') as f:
        logs = f.read()
        
    print("🤖 Gemini가 로그를 분석 중입니다...")
    summary = analyze_logs(logs)
    send_slack_message(summary)