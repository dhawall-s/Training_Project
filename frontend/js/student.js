// ============================================
// student.js - Student Panel JavaScript
// ============================================
// WHY: Contains all frontend logic for student pages
// Loads data from backend APIs and displays it on the page

// ============================================
// LOAD STUDENT DASHBOARD
// ============================================
async function loadStudentDashboard() {
    const result = await apiCall('/student/dashboard');

    if (result && result.ok) {
        const { stats, upcomingAssignments, notifications } = result.data;

        document.getElementById('attendancePercent').textContent = stats.attendancePercent + '%';
        document.getElementById('totalClasses').textContent = stats.totalClasses;
        document.getElementById('upcomingAssignments').textContent = stats.upcomingAssignments;
        document.getElementById('totalSubjects').textContent = stats.totalSubjects;

        // Display upcoming assignments
        const assignmentsList = document.getElementById('assignmentsList');
        if (assignmentsList) {
            if (upcomingAssignments.length === 0) {
                assignmentsList.innerHTML = '<div class="empty-state"><p>No upcoming assignments</p></div>';
            } else {
                assignmentsList.innerHTML = upcomingAssignments.map(a => `
                    <div class="notification-item">
                        <h4>${a.title}</h4>
                        <p>${a.description || 'No description'}</p>
                        <span class="time">Due: ${formatDate(a.dueDate)}</span>
                    </div>
                `).join('');
            }
        }

        // Display notifications
        const notifList = document.getElementById('notificationsList');
        if (notifList) {
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

// ============================================
// LOAD ATTENDANCE
// ============================================
async function loadAttendance() {
    const result = await apiCall('/student/attendance');

    if (result && result.ok) {
        const tbody = document.getElementById('attendanceTable');
        if (!tbody) return;

        if (result.data.attendance.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No attendance records found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.attendance.map(a => `
            <tr>
                <td>${formatDate(a.date)}</td>
                <td>${a.subjectId ? a.subjectId.name : 'N/A'}</td>
                <td>${a.subjectId ? a.subjectId.code : 'N/A'}</td>
                <td><span class="badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
            </tr>
        `).join('');
    }
}

// ============================================
// LOAD ASSIGNMENTS
// ============================================
async function loadAssignments() {
    const result = await apiCall('/student/assignments');

    if (result && result.ok) {
        const tbody = document.getElementById('assignmentsTable');
        if (!tbody) return;

        if (result.data.assignments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No assignments found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.assignments.map(a => `
            <tr>
                <td>${a.title}</td>
                <td>${a.subjectId ? a.subjectId.name : 'N/A'}</td>
                <td>${a.description || 'N/A'}</td>
                <td>${formatDate(a.dueDate)}</td>
                <td>
                    ${a.fileUrl
                        ? `<a href="${BASE_URL}${a.fileUrl}" target="_blank" class="btn btn-sm btn-primary"><i class="fas fa-download"></i> Download</a>`
                        : 'No file'}
                </td>
            </tr>
        `).join('');
    }
}

// ============================================
// LOAD NOTES
// ============================================
async function loadNotes() {
    const result = await apiCall('/student/notes');

    if (result && result.ok) {
        const tbody = document.getElementById('notesTable');
        if (!tbody) return;

        if (result.data.notes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No notes found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.notes.map(n => `
            <tr>
                <td>${n.title}</td>
                <td>${n.subjectId ? n.subjectId.name : 'N/A'}</td>
                <td>${formatDate(n.createdAt)}</td>
                <td>
                    <a href="${BASE_URL}${n.fileUrl}" target="_blank" class="btn btn-sm btn-success"><i class="fas fa-download"></i> Download PDF</a>
                </td>
            </tr>
        `).join('');
    }
}

// ============================================
// LOAD RESULTS
// ============================================
async function loadResults() {
    const result = await apiCall('/student/results');

    if (result && result.ok) {
        const tbody = document.getElementById('resultsTable');
        if (!tbody) return;

        if (result.data.results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No results found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.results.map(r => {
            let grade = 'F';
            if (r.marks >= 90) grade = 'A+';
            else if (r.marks >= 80) grade = 'A';
            else if (r.marks >= 70) grade = 'B+';
            else if (r.marks >= 60) grade = 'B';
            else if (r.marks >= 50) grade = 'C';
            else if (r.marks >= 40) grade = 'D';

            return `
                <tr>
                    <td>${r.subjectId ? r.subjectId.name : 'N/A'}</td>
                    <td>${r.subjectId ? r.subjectId.code : 'N/A'}</td>
                    <td>${r.marks}/100</td>
                    <td>${grade}</td>
                    <td>${r.examType || 'internal'}</td>
                </tr>
            `;
        }).join('');
    }
}

// ============================================
// LOAD TIMETABLE
// ============================================
async function loadTimetable() {
    const result = await apiCall('/student/timetable');

    if (result && result.ok) {
        const container = document.getElementById('timetableContainer');
        if (!container) return;

        if (result.data.timetable.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-calendar-days fa-3x"></i></div><p>No timetable available yet</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr></thead><tbody>';

        result.data.timetable.forEach(t => {
            if (t.periods && t.periods.length > 0) {
                t.periods.forEach((p, i) => {
                    html += `
                        <tr>
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

// ============================================
// LOAD SUBJECTS
// ============================================
async function loadSubjects() {
    const result = await apiCall('/student/subjects');

    if (result && result.ok) {
        const tbody = document.getElementById('subjectsTable');
        if (!tbody) return;

        if (result.data.subjects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No subjects found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.subjects.map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${s.name}</td>
                <td>${s.code}</td>
                <td>Semester ${s.semester}</td>
            </tr>
        `).join('');
    }
}

// ============================================
// LOAD STUDENT PROFILE
// ============================================
async function loadProfile() {
    const result = await apiCall('/auth/profile');

    if (result && result.ok) {
        const { user, details } = result.data;

        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileRole').textContent = user.role;

        if (details) {
            document.getElementById('profileRollNo').textContent = details.rollNo || 'N/A';
            document.getElementById('profileDepartment').textContent = details.department || 'N/A';
            document.getElementById('profileSemester').textContent = details.semester || 'N/A';
            document.getElementById('profilePhone').textContent = details.phone || 'N/A';
        }

        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.textContent = user.name.charAt(0).toUpperCase();
        }
    }
}
