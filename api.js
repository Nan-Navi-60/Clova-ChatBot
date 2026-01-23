//clova chatbot api통신
import HTTP from 'superagent';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const cloavaChat = process.env.CLOVACHAT;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

function makeChatbotSignature(requestBodyString) {
    return crypto
        .createHmac('sha256', CLIENT_SECRET)
        .update(requestBodyString, 'utf8')
        .digest('base64');
}

export async function chat(reqData){
    const bodyData = {
        'version': "v2",
        'timestamp': Date.now(),
        'userId': "userId",
        'bubbles': [{
            'type' : 'text',
            'data' : { 'description' : reqData.text}
        }],
        'event': "send"}

    console.log('실행횟수 확인용 root api.js');

    const requestBodyString = JSON.stringify(bodyData);
    const signature = makeChatbotSignature(requestBodyString);
    try {
        const result = await HTTP
                    .post(cloavaChat)
                    .send(requestBodyString)
                    .set('Content-Type', 'application/json; charset=UTF-8')
                    .set('X-NCP-CHATBOT_SIGNATURE', signature)
        return JSON.parse(result.text);
    } catch (error) {
        console.log("error 발생");
        console.error(error);
        const errNum = { text: 0 };
        return errNum;
    }
}