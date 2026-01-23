export const sendMessage = async (url, text) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": text
            })
        });
        if(!response.ok){
            throw new Error(`HTTP에러(${response.status})`);
        }
        const resultText = await response.text();
        return resultText;
    }catch(e){
        console.error(e);
        throw e;
    }
}