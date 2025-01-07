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

    fetch('/.netlify/functions/sendToTelegram', {
        method: 'POST',
        body: JSON.stringify({ questions: processedData }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Xử lý kết quả (nếu cần)
    })
    .catch(error => {
        alert('Lỗi kết nối với server: ' + error);
    });
});

document.getElementById('videoGuideButton').addEventListener('click', function () {
    window.open('https://drive.google.com/file/d/1DgBA0R6jlCU7KjSdF6mei_LKs5bzHf9D/view?usp=sharing', '_blank');
});
