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
function showResults() {
    const resultContainer = document.getElementById('result-container');
    const resultList = document.getElementById('result-list');
    let strandCounts = {};
    let totalSelections = 0;

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
                totalSelections++; // Count every time a strand is selected
            });
        });
    });

    // Clear previous results
    resultList.innerHTML = '';

    // Track the highest percentage strand
    let highestPercentage = 0;
    let topStrand = '';

    // Create bar graph for each strand based on normalized percentage
    Object.keys(strandCounts).forEach(strand => {
        const percentage = Math.floor((strandCounts[strand] / totalSelections) * 100);
        if (percentage > 0) {
            const resultItem = document.createElement('li');

            // Create the label for the strand and percentage
            const label = document.createElement('span');
            label.textContent = `${strand}: ${percentage}%`;
            label.classList.add('result-label');
            resultItem.appendChild(label);

            // Create the bar for the graph
            const bar = document.createElement('div');
            bar.classList.add('result-bar');
            bar.style.width = `${percentage}%`;

            // Append the bar to the list item
            resultItem.appendChild(bar);
            resultList.appendChild(resultItem);

            // Check if this strand has the highest percentage
            if (percentage > highestPercentage) {
                highestPercentage = percentage;
                topStrand = strand;
            }
        }
    });

    // Display a paragraph with a recommendation based on the top strand
    const recommendationParagraph = document.createElement('p');
    recommendationParagraph.classList.add('recommendation-text');
    recommendationParagraph.textContent = getRecommendationMessage(topStrand, highestPercentage);
    resultContainer.appendChild(recommendationParagraph);

    // Hide quiz container, show results
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    resultContainer.style.display = 'block';
}

// Function to get a recommendation message based on the top strand
function getRecommendationMessage(strand, percentage) {
    const recommendations = {
        ICT: "It looks like you're interested in technology and computers! The ICT strand is perfect for you, as it covers programming, web development, and other tech-related subjects.",
        STEM: "You're a critical thinker with a passion for science, technology, engineering, and mathematics. The STEM strand is your ideal match, preparing you for a career in these fields.",
        HUMSS: "You have a strong interest in humanities and social sciences. The HUMSS strand will help you explore history, literature, and societal issues.",
        ABM: "You're business-minded! The ABM strand will guide you through accounting, business, and management concepts, preparing you for entrepreneurship or corporate success.",
        GAS: "You're interested in a broad range of academic subjects and a flexible career path. The GAS (General Academic Strand) is designed to give you a well-rounded education, preparing you for various university courses and career options.",
        HE: "With a passion for home economics and practical life skills, the HE (Home Economics) strand will provide you with valuable knowledge in areas like culinary arts, fashion, and family management.",
        MARITIME: "Your interest in the maritime industry is exciting! The MARITIME strand offers specialized knowledge in marine studies, navigation, and ship management, preparing you for a career on the high seas."
    };
    return recommendations[strand] || `The ${strand} strand seems to be a strong choice for you, with ${percentage}% interest!`;
}
