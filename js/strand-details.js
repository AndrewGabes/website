document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const strandName = urlParams.get('strand');

    if (!strandName) {
        console.error('Strand name is missing from URL');
        return;
    }

    fetch('data/strands.json')
        .then(response => response.json())
        .then(data => {
            const strand = data.strands.find(s => s.id === strandName);

            if (!strand) {
                console.error('Strand not found:', strandName);
                return;
            }

            document.getElementById('strand-name').textContent = strand.name;
            document.getElementById('strand-description').textContent = strand.description;

            // Apply background image to header
            const header = document.getElementById('strand-header');
            if (strand.backgroundImage) {
                header.style.backgroundImage = strand.backgroundImage; // No need for url() in JavaScript
            } else {
                console.error('Background image not found for strand:', strandName);
            }
            
            // Handle subjects
            const subjectsList = document.getElementById('subjects-list');
            strand.subjects.forEach(subject => {
                const li = document.createElement('li');
                li.textContent = subject;
                subjectsList.appendChild(li);
            });

            const subjectsButton = document.getElementById('subjects-button');
            subjectsButton.addEventListener('click', () => {
                const isVisible = subjectsList.style.display === 'block';
                subjectsList.style.display = isVisible ? 'none' : 'block';
                subjectsButton.textContent = isVisible ? 'Show Subjects' : 'Hide Subjects';
            });

            // Handle college courses
            const coursesList = document.getElementById('strand-courses');
            strand.courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent = course;
                coursesList.appendChild(li);
            });

            // Populate links
            const strandLinks = document.getElementById('strand-links');
            strand.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.type;
                a.target = '_blank';
                strandLinks.appendChild(a);
                strandLinks.appendChild(document.createElement('br'));
            });
        })
        .catch(error => console.error('Error fetching strand data:', error));
});
