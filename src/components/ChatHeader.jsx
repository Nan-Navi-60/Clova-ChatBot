import React from 'react'

const ChatHeader = ({ isOpen }) => {
  return (
    <div class="chat-box-header items-center fixed w-full z-30 top-0"> 
        <h3>Woori ChatBot</h3>
        <div onClick={isOpen}>
          <img className='w-10' src="https://img.icons8.com/liquid-glass/96/scroll.png" alt="scroll" data-testid="history-sidebar" />
        </div>
    </div>
  )
}

export default ChatHeader