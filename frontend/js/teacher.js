async function loadTeacherDashboard() {
    const result = await apiCall('/teacher/dashboard');

    if (result && result.ok) {
        const { stats, notifications } = result.data;

        document.getElementById('totalStudents').textContent = stats.totalStudents;
        document.getElementById('totalAssignments').textContent = stats.totalAssignments;
        document.getElementById('totalNotes').textContent = stats.totalNotes;
        document.getElementById('totalSubjects').textContent = stats.totalSubjects;

        const notifList = document.getElementById('notificationsList');
        if (notifList && notifications) {
            if (notifications.length === 0) {
                notifList.innerHTML = '<div class="empty-state"><p>No notifications</p></div>';
            } else {
                notifList.innerHTML = notifications.map(n => `
                    <div class="notification-item">
                        <h4>${n.title}</h4>
                        <p>${n.message}</p>
                        <span class="time">${formatDate(n.createdAt)}</span>
                    </div>
                `).join('');
            }
        }
    }
}

async function loadStudentsForAttendance() {
    const result = await apiCall('/teacher/students');

    if (result && result.ok) {
        const studentList = document.getElementById('studentList');
        if (!studentList) return;

        if (result.data.students.length === 0) {
            studentList.innerHTML = '<p class="empty-state">No students found in your department</p>';
            return;
        }

        studentList.innerHTML = result.data.students.map(s => `
            <li>
                <input type="checkbox" id="student_${s._id}" value="${s._id}" checked>
                <label for="student_${s._id}">
                    <strong>${s.userId ? s.userId.name : 'N/A'}</strong>
                    (Roll: ${s.rollNo}) - Sem ${s.semester}
                </label>
            </li>
        `).join('');
    }
}

async function submitAttendance() {
    const subjectId = document.getElementById('attendanceSubject').value;
    const date = document.getElementById('attendanceDate').value;

    if (!subjectId || !date) {
        showAlert('Please select subject and date!', 'error');
        return;
    }

    const checkboxes = document.querySelectorAll('#studentList input[type="checkbox"]');
    const records = [];

    checkboxes.forEach(cb => {
        records.push({
            studentId: cb.value,
            status: cb.checked ? 'present' : 'absent'
        });
    });

    if (records.length === 0) {
        showAlert('No students found!', 'error');
        return;
    }

    const result = await apiCall('/teacher/mark-attendance', 'POST', {
        subjectId, date, records
    });

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
    } else {
        showAlert(result.data.message || 'Error marking attendance', 'error');
    }
}

async function loadTeacherSubjects() {
    const result = await apiCall('/teacher/subjects');

    if (result && result.ok) {
        const subjects = result.data.allSubjects || [];

        const dropdowns = document.querySelectorAll('.subject-dropdown');
        dropdowns.forEach(dd => {
            dd.innerHTML = '<option value="">-- Select Subject --</option>';
            subjects.forEach(s => {
                dd.innerHTML += `<option value="${s._id}">${s.name} (${s.code})</option>`;
            });
        });

        const tbody = document.getElementById('subjectsTable');
        if (tbody) {
            tbody.innerHTML = subjects.map((s, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${s.name}</td>
                    <td>${s.code}</td>
                    <td>Semester ${s.semester}</td>
                </tr>
            `).join('');
        }
    }
}

async function uploadNote() {
    const title = document.getElementById('noteTitle').value;
    const subjectId = document.getElementById('noteSubject').value;
    const file = document.getElementById('noteFile').files[0];

    if (!title || !subjectId) {
        showAlert('Please fill all fields!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subjectId', subjectId);
    if (file) formData.append('file', file);

    const result = await apiCallWithFile('/teacher/upload-note', formData);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        document.getElementById('noteForm').reset();
    } else {
        showAlert(result.data.message || 'Upload failed', 'error');
    }
}

async function uploadAssignment() {
    const title = document.getElementById('assignTitle').value;
    const description = document.getElementById('assignDesc').value;
    const subjectId = document.getElementById('assignSubject').value;
    const dueDate = document.getElementById('assignDueDate').value;
    const file = document.getElementById('assignFile').files[0];

    if (!title || !subjectId || !dueDate) {
        showAlert('Please fill all required fields!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subjectId', subjectId);
    formData.append('dueDate', dueDate);
    if (file) formData.append('file', file);

    const result = await apiCallWithFile('/teacher/upload-assignment', formData);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        document.getElementById('assignForm').reset();
    } else {
        showAlert(result.data.message || 'Upload failed', 'error');
    }
}

async function loadStudentsForMarks() {
    const result = await apiCall('/teacher/students');

    if (result && result.ok) {
        const container = document.getElementById('marksStudentList');
        if (!container) return;

        if (result.data.students.length === 0) {
            container.innerHTML = '<p class="empty-state">No students found</p>';
            return;
        }

        container.innerHTML = result.data.students.map(s => `
            <div style="display:flex; align-items:center; gap:12px; padding:10px; border-bottom:1px solid #f1f5f9;">
                <span style="flex:1;"><strong>${s.userId ? s.userId.name : 'N/A'}</strong> (${s.rollNo})</span>
                <input type="number" class="marks-input" data-student="${s._id}"
                    placeholder="Marks" min="0" max="100"
                    style="width:80px; padding:6px; border:1px solid #d1d5db; border-radius:6px;">
            </div>
        `).join('');
    }
}

async function submitMarks() {
    const subjectId = document.getElementById('marksSubject').value;
    const semester = document.getElementById('marksSemester').value;
    const examType = document.getElementById('marksExamType').value;

    if (!subjectId || !semester) {
        showAlert('Please select subject and semester!', 'error');
        return;
    }

    const marksInputs = document.querySelectorAll('.marks-input');
    const marks = [];

    marksInputs.forEach(input => {
        if (input.value) {
            marks.push({
                studentId: input.dataset.student,
                marks: parseInt(input.value)
            });
        }
    });

    if (marks.length === 0) {
        showAlert('Please enter marks for at least one student!', 'error');
        return;
    }

    const result = await apiCall('/teacher/enter-marks', 'POST', {
        subjectId, semester: parseInt(semester), examType, marks
    });

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
    } else {
        showAlert(result.data.message || 'Error saving marks', 'error');
    }
}

async function loadStudentList() {
    const result = await apiCall('/teacher/students');

    if (result && result.ok) {
        const tbody = document.getElementById('studentListTable');
        if (!tbody) return;

        if (result.data.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No students found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.students.map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${s.userId ? s.userId.name : 'N/A'}</td>
                <td>${s.rollNo}</td>
                <td>${s.userId ? s.userId.email : 'N/A'}</td>
                <td>Semester ${s.semester}</td>
            </tr>
        `).join('');
    }
}

async function loadTeacherProfile() {
    const result = await apiCall('/auth/profile');

    if (result && result.ok) {
        const { user, details } = result.data;

        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileRole').textContent = user.role;

        if (details) {
            document.getElementById('profileEmpId').textContent = details.employeeId || 'N/A';
            document.getElementById('profileDepartment').textContent = details.department || 'N/A';
            document.getElementById('profilePhone').textContent = details.phone || 'N/A';
            document.getElementById('profileQualification').textContent = details.qualification || 'N/A';
        }

        const avatar = document.getElementById('profileAvatar');
        if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
    }
}

async function loadTimetable() {
    const result = await apiCall('/teacher/timetable');

    if (result && result.ok) {
        const container = document.getElementById('timetableContainer');
        if (!container) return;

        if (result.data.timetable.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-calendar-days fa-3x"></i></div><p>No timetable available yet</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>Semester</th><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr></thead><tbody>';

        result.data.timetable.forEach(t => {
            if (t.periods && t.periods.length > 0) {
                t.periods.forEach((p, i) => {
                    html += `
                        <tr>
                            ${i === 0 ? `<td rowspan="${t.periods.length}" style="font-weight:600;">Sem ${t.semester}</td>` : ''}
                            ${i === 0 ? `<td rowspan="${t.periods.length}" style="font-weight:600;">${t.day}</td>` : ''}
                            <td>${p.time || 'N/A'}</td>
                            <td>${p.subject || 'N/A'}</td>
                            <td>${p.teacher || 'N/A'}</td>
                        </tr>
                    `;
                });
            }
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }
}
