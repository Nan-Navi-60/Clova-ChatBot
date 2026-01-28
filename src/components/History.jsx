import React from 'react'

const History = ({reqHistory ,message}) => {

    const formatDate = () => {
        const date = new Date(message.date);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}. ${month}. ${day}. ${hours}: ${minutes}`;
    }

  return (
    <div data-testid="history-item"
        onClick={() => reqHistory(message.text)}
        className='flex flex-col items-start
         bg-sky-200 rounded-2xl
          shadow-[0px_4px_3px_1px_rgba(34,38,58,0.4)]
           ml-2 mr-2 mt-2 mb-1 p-3 h-fit max-h-25'
    >
        <a className='text-lg overflow-hidden text-ellipsis w-11/12 whitespace-nowrap'>{message.text}</a>
        <a className='text-sm text-gray-700'>
            {formatDate()}
        </a>
    </div>
  )
}

export default History