document.addEventListener('DOMContentLoaded', () => {
    const addSubjectBtn = document.getElementById('add-subject');
    const subjectInputs = document.getElementById('subject-inputs');
    const generateBtn = document.getElementById('generate-btn');
    const timetableOutput = document.getElementById('timetable-output');
    const timetableDisplay = document.getElementById('timetable-display');
    const downloadPdfBtn = document.getElementById('download-pdf');

    // 1. Add Subject Input
    addSubjectBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <input type="text" placeholder="Subject Name (e.g., Physics)" class="subject-name">
            <input type="number" placeholder="Priority (1-5)" class="subject-priority" min="1" max="5">
        `;
        subjectInputs.appendChild(div);
    });

    // 2. Generate Timetable Logic
    generateBtn.addEventListener('click', () => {
        const names = document.querySelectorAll('.subject-name');
        const priorities = document.querySelectorAll('.subject-priority');
        const subjects = Array.from(names).map((input, i) => ({ name: input.value, priority: priorities[i].value }));
        const totalHours = parseFloat(document.getElementById('daily-hours').value);

        if (!Number.isFinite(totalHours) || totalHours < 1 || totalHours > 16) {
            alert('Please enter between 1 and 16 study hours per day.');
            return;
        }

        const timetable = allocateHours(subjects, totalHours);
        if (timetable.length === 0) {
            alert('Please add at least one subject!');
            return;
        }

        renderTimetable(timetable);
        timetableOutput.classList.remove('hidden');
        timetableOutput.scrollIntoView({ behavior: 'smooth' });
    });

    // Built with DOM APIs and textContent: subject names are user input and were pasted into innerHTML.
    function renderTimetable(data) {
        const table = document.createElement('table');
        table.innerHTML = '<thead><tr><th>Subject</th><th>Recommended Daily Hours</th></tr></thead>';
        const tbody = document.createElement('tbody');
        data.forEach((item) => {
            const tr = document.createElement('tr');
            const name = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = item.name;
            name.appendChild(strong);
            const hours = document.createElement('td');
            hours.textContent = `${item.hours.toFixed(1)} hrs`;
            tr.append(name, hours);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        timetableDisplay.replaceChildren(table);
    }

    // 3. Download PDF
    downloadPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('timetable-display');
        const opt = {
            margin: 1,
            filename: 'my-smart-timetable.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (typeof html2pdf === 'undefined') {
            alert('PDF export could not load (check your connection). You can still print this page.');
            return;
        }
        html2pdf().set(opt).from(element).save();
    });
});
