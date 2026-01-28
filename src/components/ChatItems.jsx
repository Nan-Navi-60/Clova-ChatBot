
const ChatItems = ({ content }) => {
  
  const isUser = content.who === "user";
  const alignment = isUser ? "items-end" : "items-start";

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return (
    <div className={`flex flex-col ${alignment}`}>
        <a className={`message ${content.who} w-fit break-all whitespace-pre-wrap`}>
          {content.text}
        </a>
        <a className="text-xs text-gray-400 mt-1 mx-1">{hours}: {minutes}</a>
    </div>
  )
}

export default ChatItems