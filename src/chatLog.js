export function saveChatLog(text) {
    let currentHistory = [];
    const storedData = localStorage.getItem("chatLog");

    if (storedData) {
        try {
        currentHistory = JSON.parse(storedData);
        } catch (e) {
        console.error("저장된 기록 파싱 실패", e);
        }
    }

    const newMessage = {
        text: text,
        date: Date.now()
    }

    currentHistory.push(newMessage);

    localStorage.setItem("chatLog", JSON.stringify(currentHistory));
}

export function loadChatLog() {
    const history = localStorage.getItem("chatLog");
    if (!history) return [];
    return JSON.parse(history);
}

export function allRemoveCookie() {
    localStorage.removeItem("chatLog");
}