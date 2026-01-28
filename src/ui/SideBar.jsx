import React, { useState } from 'react'
import History from '../components/History'
import { allRemoveCookie, loadChatLog } from '../chatLog'

const SideBar = ({ reqHistory }) => {

    const chatLog = loadChatLog();

    const [log, setLog] = useState(chatLog);

    const history = chatLog.map((x) => <History reqHistory={reqHistory} message={x} />)

    const removeLog = () => {
        allRemoveCookie();
        const nullList = [];
        setLog(nullList);
    }

  return (
    <div data-testid="history-sidebar" className='absolute overflow-y-auto bottom-0 z-10 w-full bg-sky-600 m-0 right-0 top-15'>
        <div 
         className='justify-self-end text-white bg-rose-700
         rounded-md m-2 pt-1 pb-1 pl-2 pr-2 
         shadow-[0px_1px_1px_2px_rgba(34,38,58,0.4)]'
         onClick={removeLog}
        >
            <button data-testid="clear-history-btn">기록 모두 삭제</button>
        </div>
        {history}
    </div>
  )
}

export default SideBar