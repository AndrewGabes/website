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

            // Update the header with the strand name
            document.getElementById('strand-title').textContent = strand.name;

            // Update strand details
            document.getElementById('strand-name').textContent = strand.name;
            document.getElementById('strand-description').textContent = strand.description;

            // Apply background image to header
            const header = document.getElementById('strand-header');
            if (strand.backgroundImage) {
                header.style.backgroundImage = strand.backgroundImage;
            }

            // Create and populate tabs
            populateSubjectsTab(strand.subjects);
            populateCoursesTab(strand.courses);
            populateLinksTab(strand.links);

            // Automatically open the first tab by default
            window.openTab(null, 'subjects-tab');  // Calling globally
        })
        .catch(error => console.error('Error fetching strand data:', error));

    // Attach openTab to the window object to make it globally accessible
    window.openTab = function(evt, tabId) {
        const tabContent = document.getElementsByClassName('tabcontent');
        const tabLinks = document.getElementsByClassName('tablinks');

        // Hide all tab content
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = 'none';
        }

        // Remove 'active' class from all tab links
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(' active', '');
        }

        // Show the clicked tab's content
        document.getElementById(tabId).style.display = 'block';

        // Add 'active' class to the clicked tab button
        if (evt) {
            evt.currentTarget.className += ' active';
        } else {
            // If no event (like on page load), activate the first tab button
            tabLinks[0].className += ' active';
        }
    };

    function populateSubjectsTab(subjects) {
        // Populate Grade 11 subjects
        populateSubjects(document.getElementById('grade11-firstSemester'), subjects.grade11.firstSemester);
        populateSubjects(document.getElementById('grade11-secondSemester'), subjects.grade11.secondSemester);

        // Populate Grade 12 subjects
        populateSubjects(document.getElementById('grade12-firstSemester'), subjects.grade12.firstSemester);
        populateSubjects(document.getElementById('grade12-secondSemester'), subjects.grade12.secondSemester);
    }

    function populateCoursesTab(courses) {
        const coursesList = document.getElementById('strand-courses');
        courses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course;
            coursesList.appendChild(li);
        });
    }

    function populateLinksTab(links) {
        const strandLinks = document.getElementById('strand-links');
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.type;
            a.target = '_blank';
            strandLinks.appendChild(a);
            strandLinks.appendChild(document.createElement('br'));
        });
    }

    function populateSubjects(listElement, subjects) {
        listElement.innerHTML = ''; // Clear previous subjects
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.textContent = subject;
            listElement.appendChild(li);
        });
    }
});
