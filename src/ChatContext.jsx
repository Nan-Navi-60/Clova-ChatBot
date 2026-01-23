import React, { createContext, useReducer } from 'react'
import Reducer from './Reducer';

const chatList = {
  messages: [
    {id: 1, text: "궁금하신 내용을 입력해주세요!"}
  ]
};

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [state, dispatch] =
   useReducer(Reducer, chatList);

   return (
    <ChatContext.Provider value={{ state, dispatch }}>
        {children}
    </ChatContext.Provider>
   )
}