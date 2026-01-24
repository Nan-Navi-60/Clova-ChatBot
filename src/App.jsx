import './App.css'
import DefaultLayout from './components/DefaultLayout'
import ChatHeader from './components/ChatHeader'
import ChatBody from './components/ChatBody'
import ChatInput from './components/ChatInput'
import Reducer from './Reducer'
import { useReducer, useState } from 'react'
import { sendMessage } from './api'
import SideBar from './ui/SideBar'
import { createPortal } from 'react-dom'
import { saveChatLog } from './chatLog'

const firstConnectTime = Date.now();

const chatList = {
  messages: [
    {id: 1, text: "궁금하신 내용을 입력해주세요!", who: "bot", date: firstConnectTime},
  ]
};

function App() {

  const [state, dispatch] =
   useReducer(Reducer, chatList);
  
  const [loading, setLoading] = useState(true);
  const [sended, setSend] = useState(true);
  const [sideBar, onSidebar] = useState(false);

  const getResponse = async (intputText) => {
      try{
        //답변 받는 api 호출
        const responseText = await sendMessage("http://localhost:3000/sendChat", intputText);
        resChatbot(responseText);
      }catch(e){
        console.error(e);
        const responseText = "요청을 처리하지 못했습니다. 다시 시도해주세요."
        resChatbot(responseText);
      }
  }

  const enterHandler = (inputText) => {
    dispatch({ type: "REQCHAT", text: inputText });
    setSend(false);
    setLoading(false);
    saveChatLog(inputText);
    getResponse(inputText);
  }

  const resChatbot = (inputText) => {
    dispatch({ type: "RESCHAT", text: inputText});
    setLoading(true);
    setSend(true);
  }

  const reqHistory = (text) => {
    onSidebar(!sideBar);
    enterHandler(text);
  }

  return (
    <>
      <DefaultLayout>
        <ChatHeader isOpen={() => onSidebar(!sideBar)}/>
        <ChatBody
         messages={state.messages} loading={loading}
         resetBtn={() => dispatch({ type: "RESET", text: null})}
        />

        {sideBar &&
         createPortal(<SideBar reqHistory={reqHistory} />,
         document.getElementById('chat-body'))
        }

        <ChatInput onEnter={enterHandler} sended={sended}/>
      </DefaultLayout>
    </>
  )
}

export default App
