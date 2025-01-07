const TELEGRAM_TOKEN = '7656286886:AAGZmLzJQTbXAj5_BCHs1EZMrna9B-ZIp-E';  
const TELEGRAM_CHAT_ID = '6623256952';  

const fetch = require('node-fetch');  // Netlify Functions hỗ trợ `node-fetch`

exports.handler = async function(event, context) {
    try {
        const body = JSON.parse(event.body);  // Phân tích dữ liệu JSON từ client
        console.log('Received data:', body);

        // Gửi thông báo đến Telegram
        const message = body.questions.map((q, index) => {
            return `Câu hỏi ${index + 1}: ${q.questionHtml}\nLựa chọn: ${q.answerOptions.join(', ')}`;
        }).join('\n\n');

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to send message to Telegram');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Sent to Telegram successfully' })
        };
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};
