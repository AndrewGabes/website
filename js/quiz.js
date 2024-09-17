let currentQuestionIndex = 0;
let userSelections = {};
let quizData = null;
let strandData = null;  // Add a variable to store strand data
let totalStrandSelections = 0; // Track total selections

// Load the quiz and strand data
Promise.all([
    fetch('data/quiz.json').then(response => response.json()),
    fetch('data/strands.json').then(response => response.json())
])
.then(([quiz, strands]) => {
    quizData = quiz.questions;
    strandData = strands.strands;  // Save the strands data
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
    const quizContainer = document.getElementById('quiz-container');
    const navigation = document.getElementById('navigation');
    const strandCard = document.getElementById('strand-card');
    const strandLink = document.getElementById('strand-link');
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
                totalSelections++;
            });
        });
    });

    // Prepare data for pie chart
    const strandNames = Object.keys(strandCounts);
    const strandValues = Object.values(strandCounts);

    // Find the highest percentage strand
    let highestPercentage = 0;
    let topStrandId = '';

    strandValues.forEach((value, index) => {
        const percentage = Math.floor((value / totalSelections) * 100);
        if (percentage > highestPercentage) {
            highestPercentage = percentage;
            topStrandId = strandNames[index]; // This is the strand ID (e.g., 'STEM')
        }
    });

    // Convert the topStrandId to lowercase to match the IDs in strandData
    topStrandId = topStrandId.toLowerCase();

    // Find the full strand name based on the ID
    const topStrand = strandData.find(strand => strand.id === topStrandId);

    // Check if topStrand is found
    if (!topStrand) {
        console.error(`Strand with ID "${topStrandId}" not found in strandData.`);
        return;
    }

    // Hide quiz container and navigation
    quizContainer.style.display = 'none';
    navigation.style.display = 'none';

    // Create the pie chart
    const ctx = document.getElementById('pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: strandNames,
            datasets: [{
                data: strandValues,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf']
            }]
        }
    });

    // Display recommended strand and explanation
    document.getElementById('recommended-strand').textContent = topStrand.name; // Use the full name
    document.getElementById('recommendation-text').textContent = getRecommendationMessage(topStrandId, highestPercentage);

    // Show the highest strand card for quick access
    strandLink.href = `strand-details.html?strand=${topStrand.id}`; // Update href dynamically
    strandCard.style.backgroundImage = `url('images/${topStrand.id}.png')`; // Update background using the strand ID
    strandCard.innerHTML = `<h3>${topStrand.name}</h3>`; // Display the strand name

    // Show result container and strand card
    resultContainer.style.display = 'block';
    strandLink.style.display = 'block'; // Make the link visible
}




// Function to get a recommendation message based on the top strand
function getRecommendationMessage(strand, percentage) {
    const recommendations = {
        ict: "It looks like you're interested in technology and computers! The ICT strand is perfect for you, as it covers programming, web development, and other tech-related subjects.",
        stem: "You're a critical thinker with a passion for science, technology, engineering, and mathematics. The STEM strand is your ideal match, preparing you for a career in these fields.",
        humss: "You have a strong interest in humanities and social sciences. The HUMSS strand will help you explore history, literature, and societal issues.",
        abm: "You're business-minded! The ABM strand will guide you through accounting, business, and management concepts, preparing you for entrepreneurship or corporate success.",
        gas: "You're interested in a broad range of academic subjects and a flexible career path. The GAS (General Academic Strand) is designed to give you a well-rounded education, preparing you for various university courses and career options.",
        he: "With a passion for home economics and practical life skills, the HE (Home Economics) strand will provide you with valuable knowledge in areas like culinary arts, fashion, and family management.",
        maritime: "Your interest in the maritime industry is exciting! The MARITIME strand offers specialized knowledge in marine studies, navigation, and ship management, preparing you for a career on the high seas."
    };
    return recommendations[strand] || `The ${strand} strand seems to be a strong choice for you, with ${percentage}% interest!`;
}
