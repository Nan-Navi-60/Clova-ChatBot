//서버 배포 및 클라이언트 요청수락
import express, {json} from 'express';
import { chat } from './api.js';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.static('public'));
app.use(json());

//채팅 보내기
app.post('/sendChat', async (request, response) => {
    try{        
        const data = request.body;  
        console.log('실행횟수 확인용 server.js');
        
        const result = await chat(data);
    
        if(result.text === 0){
            console.log("API 에러 감지: 0 반환됨");
            return response.status(500).json({ text: "API 통신 중 문제가 발생하였습니다." });
        }
    
        let resultBubbles = result.bubbles;
        const text = resultBubbles[0].data.description;
        

        response.send(text)

    }catch(e){
        console.error(e);
        response.send("API통신 중 문제가 발생하였습니다. 2")
    }
});

app.listen(PORT, () => console.log(`Express 서버가 http://localhost:${PORT} 에서 대기중`));
