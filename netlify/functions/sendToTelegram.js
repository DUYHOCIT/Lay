const axios = require('axios');
const FormData = require('form-data');
const { Blob } = require('buffer');

const TELEGRAM_TOKEN = '7656286886:AAGZmLzJQTbXAj5_BCHs1EZMrna9B-ZIp-E';  // Thay token thực tế
const TELEGRAM_CHAT_ID = '6623256952';  // Thay chat ID thực tế

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { questions } = JSON.parse(event.body);

    let htmlContent = '<html><head><title>Kết quả xử lý JSON</title></head><body>';
    htmlContent += '<h1>Câu hỏi</h1>';

    questions.forEach((item, index) => {
      htmlContent += `<h2>Câu ${index + 1}</h2>`;
      htmlContent += `<p>${item.questionHtml}</p>`;
      htmlContent += '<ul>';
      item.answerOptions.forEach(option => {
        htmlContent += `<li>${option.value}</li>`;
      });
      htmlContent += '</ul>';
    });

    htmlContent += '</body></html>';

    // Tạo FormData để gửi file đến Telegram
    const formData = new FormData();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const file = new Buffer(blob);
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', file, 'ketqua.html');

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Kết quả đã được gửi đến Telegram.' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Lỗi khi xử lý dữ liệu', error: error.message })
    };
  }
};
