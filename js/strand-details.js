document.addEventListener('DOMContentLoaded', () => {
    const fetchStrandData = async () => {
        try {
            const response = await fetch('data/strands.json');
            if (!response.ok) throw new Error('Failed to load strands.json');
            const data = await response.json();
            loadStrandDetails(data);
        } catch (error) {
            console.error('Error fetching strand data:', error);
            displayError("Unable to load data. Please try again later.");
        }
    };

    const loadStrandDetails = (data) => {
        const strandName = new URLSearchParams(window.location.search).get('strand');
        if (!strandName) {
            displayError("Strand not specified. Redirecting...");
            return;
        }

        const strand = data.strands.find(s => s.id === strandName);
        if (!strand) {
            displayError("Strand not found. Redirecting...");
            return;
        }

        // Update Strand Details
        document.getElementById('strand-name').textContent = strand.name || "Unknown Strand";
        document.getElementById('strand-description').textContent = strand.description || "No description available.";
        document.body.style.backgroundImage = `url(${strand.backgroundImage})`;

        // Add tabs
        createTab('Subjects', 'subjects-tab', createSubjectsContent(strand.subjects));
        createTab('College Courses', 'courses-tab', createCoursesContent(strand.courses));
        createTab('Related Links', 'links-tab', createLinksContent(strand.links));
        createTab('Career Prospects', 'careers-tab', createCareerContent(strand.courses)); // New Feature

        document.querySelector('.tablinks').click(); // Open first tab by default
    };

    const createCareerContent = (courses) => {
        const div = document.createElement('div');
        div.innerHTML = "<h3>Career Prospects</h3>";
        if (!courses || !courses.length) {
            div.innerHTML += "<p>No career prospects available.</p>";
        } else {
            courses.forEach(course => {
                const p = document.createElement('p');
                p.textContent = `Career paths for ${course}`;
                div.appendChild(p);
            });
        }
        return div;
    };

    const createSubjectsContent = (subjects) => {
        const container = document.createElement('div');
        if (!subjects) {
            container.innerHTML = "<p>No subjects available.</p>";
            return container;
        }
        ['Grade 11', 'Grade 12'].forEach((grade, index) => {
            const gradeDiv = document.createElement('div');
            gradeDiv.className = 'grade-section';
            gradeDiv.innerHTML = `<h3>${grade}</h3>`;
            ['First Semester', 'Second Semester'].forEach((semester, semesterIndex) => {
                const semesterDiv = document.createElement('div');
                semesterDiv.className = 'semester-section';
                semesterDiv.innerHTML = `<h4>${semester}</h4>`;
                const subjectList = document.createElement('ul');
                const semesterSubjects = subjects[`${index === 0 ? 'grade11' : 'grade12'}`]?.[
                    `${semesterIndex === 0 ? 'firstSemester' : 'secondSemester'}`
                ];
                if (semesterSubjects) {
                    semesterSubjects.forEach(subject => {
                        const li = document.createElement('li');
                        li.textContent = subject;
                        subjectList.appendChild(li);
                    });
                } else {
                    subjectList.innerHTML = "<li>No subjects available.</li>";
                }
                semesterDiv.appendChild(subjectList);
                gradeDiv.appendChild(semesterDiv);
            });
            container.appendChild(gradeDiv);
        });
        return container;
    };

    const createCoursesContent = (courses) => {
        const ul = document.createElement('ul');
        if (!courses || !courses.length) {
            ul.innerHTML = "<li>No courses available.</li>";
        } else {
            courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent = course;
                ul.appendChild(li);
            });
        }
        return ul;
    };

    const createLinksContent = (links) => {
        const div = document.createElement('div');
        if (!links || !links.length) {
            div.innerHTML = "<p>No links available.</p>";
        } else {
            links.forEach(link => {
                const anchor = document.createElement('a');
                anchor.href = link.url;
                anchor.textContent = link.type || "Link";
                anchor.target = '_blank';
                div.appendChild(anchor);
            });
        }
        return div;
    };

    const createTab = (title, id, content) => {
        const tabButtons = document.querySelector('.tab-buttons');
        const button = document.createElement('button');
        button.className = 'tablinks';
        button.textContent = title;
        button.onclick = (event) => openTab(event, id);
        tabButtons.appendChild(button);

        const tabContent = document.createElement('div');
        tabContent.id = id;
        tabContent.className = 'tabcontent';
        tabContent.appendChild(content);
        document.querySelector('.tab-content').appendChild(tabContent);
    };

    const openTab = (event, tabId) => {
        document.querySelectorAll('.tabcontent').forEach(tc => {
            tc.style.opacity = '0';
            tc.style.display = 'none';
        });
        document.querySelectorAll('.tablinks').forEach(tb => tb.classList.remove('active'));
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.style.display = 'block';
            setTimeout(() => (activeTab.style.opacity = '1'), 50);
        }
        event.currentTarget.classList.add('active');
    };

    const displayError = (message) => {
        alert(message);
        window.location.href = "index.html";
    };

    fetchStrandData();
});
