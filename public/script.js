document.getElementById('addJsonButton').addEventListener('click', function () {
    const jsonInputs = document.getElementById('jsonInputs');
    const newJsonGroup = document.createElement('div');
    newJsonGroup.className = 'json-group';
    newJsonGroup.innerHTML = `
        <textarea class="jsonInput" placeholder="Dán vào đây ní ơi..."></textarea>
        <button class="deleteButton">&times;</button>
    `;
    jsonInputs.appendChild(newJsonGroup);

    const deleteButton = newJsonGroup.querySelector('.deleteButton');
    deleteButton.addEventListener('click', function () {
        jsonInputs.removeChild(newJsonGroup);
    });
});



document.getElementById('processButton').addEventListener('click', function () {
    const jsonInputs = document.querySelectorAll('.jsonInput');
    const uniqueQuestions = new Map();

    // Xử lý các input JSON
    jsonInputs.forEach(input => {
        const jsonInput = input.value;
        if (!jsonInput.trim()) return;

        try {
            const data = JSON.parse(jsonInput);
            data.data.forEach(record => {
                record.test.forEach(test => {
                    const questionId = test.id;
                    if (!uniqueQuestions.has(questionId)) {
                        uniqueQuestions.set(questionId, {
                            questionHtml: test.question_direction,
                            answerOptions: test.answer_option
                        });
                    }
                });
            });
        } catch (error) {
            alert('Một trong các dữ liệu JSON không hợp lệ. Vui lòng kiểm tra lại.');
            throw error;
        }
    });

    const processedData = Array.from(uniqueQuestions).map(([id, data]) => ({
        questionHtml: data.questionHtml,
        answerOptions: data.answerOptions
    }));

    console.log('Processed data:', processedData);  // Kiểm tra dữ liệu trước khi gửi

    fetch('/.netlify/functions/sendToTelegram', {
        method: 'POST',
        body: JSON.stringify({ questions: processedData }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.text())  // Đọc phản hồi dưới dạng văn bản
    .then(data => {
        console.log('Response from server:', data);
        try {
            const jsonData = JSON.parse(data);  // Thử phân tích dữ liệu JSON
            // Xử lý phản hồi từ server ở đây
        } catch (error) {
            alert('Lỗi phân tích JSON từ server: ' + error);
        }
    })
    .catch(error => {
        alert('Lỗi kết nối với server: ' + error);
    });
});
