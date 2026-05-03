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
        const subjects = [];
        const nameInputs = document.querySelectorAll('.subject-name');
        const priorityInputs = document.querySelectorAll('.subject-priority');
        const totalHours = parseFloat(document.getElementById('daily-hours').value);

        let totalPriority = 0;

        nameInputs.forEach((input, index) => {
            const name = input.value.trim();
            const priority = parseInt(priorityInputs[index].value) || 1;
            if (name) {
                subjects.push({ name, priority });
                totalPriority += priority;
            }
        });

        if (subjects.length === 0) {
            alert('Please add at least one subject!');
            return;
        }

        // Calculate hours per subject based on priority weight
        const timetable = subjects.map(s => {
            const allocatedHours = (s.priority / totalPriority) * totalHours;
            return {
                name: s.name,
                hours: allocatedHours.toFixed(1)
            };
        });

        renderTimetable(timetable);
        timetableOutput.classList.remove('hidden');
        timetableOutput.scrollIntoView({ behavior: 'smooth' });
    });

    function renderTimetable(data) {
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Recommended Daily Hours</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(item => {
            html += `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.hours} hrs</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        timetableDisplay.innerHTML = html;
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

        html2pdf().set(opt).from(element).save();
    });
});
