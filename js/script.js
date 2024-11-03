document.addEventListener('DOMContentLoaded', () => {
    fetch('data/strands.json')
        .then(response => response.json())
        .then(data => {
            const strandContainer = document.getElementById('strand-container');
            const numCards = data.strands.length;
            const angleIncrement = 360 / numCards;
            let currentAngle = 0;
            let currentIndex = 0;

            data.strands.forEach((strand, index) => {
                const strandCardLink = document.createElement('a');
                strandCardLink.href = `strand-details.html?strand=${encodeURIComponent(strand.id)}`;
                strandCardLink.className = 'strand-card-link';

                const strandCard = document.createElement('div');
                strandCard.className = 'strand-card card text-white';
                strandCard.style.backgroundImage = `url('${strand.backgroundImage}')`;

                strandCard.innerHTML = `
                    <div class="card-body">
                        <h2 class="strand-title card-title">${strand.name}</h2>
                        <p class="strand-description card-text">${strand.description}</p>
                    </div>
                `;

                const rotationAngle = index * angleIncrement;
                strandCardLink.style.transform = `rotateY(${rotationAngle}deg) translateZ(600px)`;

                strandCardLink.appendChild(strandCard);
                strandContainer.appendChild(strandCardLink);
            });

            const strandCards = Array.from(strandContainer.getElementsByClassName('strand-card-link'));

            function updateCarousel() {
                strandContainer.style.transform = `rotateY(${-currentAngle}deg)`;
                strandCards.forEach((card, i) => {
                    const distanceFromCenter = Math.abs(i - currentIndex);
                    
                    // Center card: remove overlay, make clickable
                    if (i === currentIndex) {
                        card.classList.add('active');
                        card.style.pointerEvents = 'auto';
                    } 
                    // Adjacent and distant cards: add overlay, disable clicks
                    else {
                        card.classList.remove('active');
                        card.style.pointerEvents = 'none';
                    }
                });
            }

            document.querySelector('.next').addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % strandCards.length;
                currentAngle += angleIncrement;
                updateCarousel();
            });

            document.querySelector('.prev').addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + strandCards.length) % strandCards.length;
                currentAngle -= angleIncrement;
                updateCarousel();
            });

            updateCarousel(); // Initialize carousel
        })
        .catch(error => console.error('Error fetching strand data:', error));
});
