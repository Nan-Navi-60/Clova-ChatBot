import { createElement, useState } from "react";

const ChatInput = ({ onEnter, sended }) => {

  const [warning, setWarning] = useState(false);

  const enterEventHandler = (e) => {
    const input = document.getElementById("userInput");
    if(e.shiftKey && e.key === 'Enter'){
      return;
    }else if(e.key === 'Enter'){
      e.preventDefault()
      if(input.value.trim() === ""){        
        setWarning(true);
      }else{
        setWarning(false);        
        onEnter(input.value.trim());
        input.value = "";
      }
    }
  }

  return (
    <>
    <div className="m-8 relative">
      <div className="w-full chat-box-footer mb-1">
        <textarea id="userInput" type="text"
          className="w-full rounded-md no-scrollbar resize-none border-[0.1rem]"
          placeholder="Type your message..."
          onKeyDown={sended && enterEventHandler}
        />
        <button disabled={sended} id="sendBtn">Send</button>
      </div>
        <a className={`absolute text-red-500 text-xs ${!warning && 'hidden'} pl-3`}>내용을 입력해주세요!</a>
    </div>
    </>
  )
}

export default ChatInput