let currentQuestionIndex = 0;
let userSelections = {};
let quizData = null;
let totalStrandSelections = 0; // Track total selections

// Load the quiz data
fetch('data/quiz.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.questions;
        showQuestion();
    });

// Function to display a question
function showQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const question = quizData[currentQuestionIndex];

    // Clear the previous question
    quizContainer.innerHTML = '';

    // Display the current question
    const questionElement = document.createElement('h2');
    questionElement.textContent = question.question;
    quizContainer.appendChild(questionElement);

    // Display the choices (checkboxes)
    question.choices.forEach(choice => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = choice.text;
        input.name = question.id;
        label.classList.add('modern-checkbox');
        label.appendChild(input);
        label.appendChild(document.createTextNode(choice.text));
        quizContainer.appendChild(label);
        quizContainer.appendChild(document.createElement('br'));
    });
}

// Handle Next button click
document.getElementById('next-btn').addEventListener('click', () => {
    // Save the current question's selections
    const selectedOptions = Array.from(document.querySelectorAll(`input[name="${quizData[currentQuestionIndex].id}"]:checked`)).map(input => input.value);
    userSelections[quizData[currentQuestionIndex].id] = selectedOptions;

    // Increment the total number of selections
    totalStrandSelections += selectedOptions.length;

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
});

// Function to calculate and display results
function showResults() {
    const resultContainer = document.getElementById('result-container');
    const resultList = document.getElementById('result-list');
    let strandCounts = {};

    // Calculate strand recommendations based on selections
    Object.keys(userSelections).forEach(questionId => {
        const question = quizData.find(q => q.id === questionId);
        userSelections[questionId].forEach(selectedChoice => {
            const choice = question.choices.find(c => c.text === selectedChoice);
            choice.strands.forEach(strand => {
                if (!strandCounts[strand]) {
                    strandCounts[strand] = 0;
                }
                strandCounts[strand]++;
            });
        });
    });

    // Convert to percentages and avoid exceeding 100%
    Object.keys(strandCounts).forEach(strand => {
        const percentage = Math.floor((strandCounts[strand] / totalStrandSelections) * 100);
        if (percentage > 0) {
            const resultItem = document.createElement('li');
            resultItem.textContent = `${strand}: ${percentage}%`;
            resultList.appendChild(resultItem);
        }
    });

    // Hide quiz container, show results
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    resultContainer.style.display = 'block';
}
