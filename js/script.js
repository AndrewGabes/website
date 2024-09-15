document.addEventListener('DOMContentLoaded', () => {
    fetch('data/strands.json')
        .then(response => response.json())
        .then(data => {
            const strandContainer = document.getElementById('strand-container');
            data.strands.forEach(strand => {
                const strandCardLink = document.createElement('a');
                strandCardLink.href = `strand-details.html?strand=${encodeURIComponent(strand.id)}`;
                strandCardLink.className = 'strand-card-link';

                const strandCard = document.createElement('div');
                strandCard.className = 'strand-card';
                strandCard.style.backgroundImage = strand.backgroundImage; // Set background image
                strandCard.style.color = strand.colorScheme; // Set color scheme
                
                const strandTitle = document.createElement('h2');
                strandTitle.className = 'strand-title';
                strandTitle.textContent = strand.name;
                strandCard.appendChild(strandTitle);

                const strandDescription = document.createElement('p');
                strandDescription.className = 'strand-description';
                strandDescription.textContent = strand.description;
                strandCard.appendChild(strandDescription);

                strandCardLink.appendChild(strandCard);
                strandContainer.appendChild(strandCardLink);
            });
            // Smooth scroll to strand-container when "Explore Strands" is clicked
            document.getElementById('explore-button').addEventListener('click', () => {
                document.getElementById('strand-container').scrollIntoView({ behavior: 'smooth' });
            });
            
        })
        .catch(error => console.error('Error fetching strand data:', error));
});     
