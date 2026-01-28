import React, { useEffect, useRef, useState } from 'react'
import ChatItems from './ChatItems'
import Loading from '../ui/Loading';

const ChatBody = ({ messages, loading, resetBtn }) => {
  
  const chatList = messages.map((chat, idx) => (
  <ChatItems key={chat.id ?? idx} content={chat} />));
  const chatContainerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      const viewHeight = container.clientHeight;
      const scrollValue = viewHeight * 0.8;

      if(messages.length > 1) setShowButton(true);

      const { scrollTop, scrollHeight, clientHeight } = container;

      // const isAtBottom = scrollHeight - scrollTop - clientHeight <= 10;

      // if (!isAtBottom) {
      //   setShowButton(true);
      // } else {
      //   setShowButton(false);
      // }

      container.scrollBy({
        top: scrollValue,
        behavior: 'smooth'  
      });
    }
  },[messages] );

  const loadingSpiner = () => {
    return <a className={`message bot w-fit break-all`}><Loading /></a>
  }

  return (
    <>
        <div id="chat-body" className="top-15 chat-box-body flex flex-col h-full" ref={chatContainerRef}>
            {chatList}
            {!loading && loadingSpiner()}
        </div>
        {showButton && loading && (
        <button 
            onClick={() => {
              resetBtn();
              setShowButton(false);
            }}
            className="bottom-5 bg-blue-500 text-white p-2 rounded-full shadow-lg transition-opacity hover:bg-blue-600 m-2"
            data-testid="reset-btn" >
            대화 기록 초기화
        </button> 
      )}
    </>
  )
}

export default ChatBody