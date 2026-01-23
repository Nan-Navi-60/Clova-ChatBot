const Reducer = (state, action) => {
  const nowDate = Date.now();
  switch(action.type){
    case "REQCHAT": {
      const message = {text: action.text, id: Math.random(), who: "user", date: nowDate};
      const newMessages = [...state.messages, message];
      return {...state, messages: newMessages};
    }

    case "RESCHAT": {
      const resMassage = {text: action.text, id: Math.random(), who: "bot", date: nowDate};
      const newResMessages = [...state.messages, resMassage];
      return {...state, messages: newResMessages};
    }

    case "RESET": {
      const resetMassage = {id: 1, text: "궁금하신 내용을 입력해주세요!", who: "bot", date: nowDate}
      const newResMessages = [resetMassage];
      return {...state, messages: newResMessages};
    }
  }
}

export default Reducer