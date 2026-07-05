// ============================================
// admin.js - Admin Panel JavaScript
// ============================================

// ============================================
// LOAD ADMIN DASHBOARD
// ============================================
async function loadAdminDashboard() {
    const result = await apiCall('/admin/dashboard');

    if (result && result.ok) {
        const { stats, recentNotifications } = result.data;

        document.getElementById('totalStudents').textContent = stats.totalStudents;
        document.getElementById('totalTeachers').textContent = stats.totalTeachers;
        document.getElementById('totalSubjects').textContent = stats.totalSubjects;
        document.getElementById('totalDepartments').textContent = stats.totalDepartments;

        const notifList = document.getElementById('notificationsList');
        if (notifList && recentNotifications) {
            if (recentNotifications.length === 0) {
                notifList.innerHTML = '<div class="empty-state"><p>No notifications</p></div>';
            } else {
                notifList.innerHTML = recentNotifications.map(n => `
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
// MANAGE STUDENTS
// ============================================
async function loadAllStudents() {
    const result = await apiCall('/admin/students');

    if (result && result.ok) {
        const tbody = document.getElementById('studentsTable');
        if (!tbody) return;

        if (result.data.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No students found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.students.map(s => `
            <tr>
                <td>${s.userId ? s.userId.name : 'N/A'}</td>
                <td>${s.userId ? s.userId.email : 'N/A'}</td>
                <td>${s.rollNo}</td>
                <td>${s.department}</td>
                <td>${s.semester}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-warning" onclick="editStudent('${s._id}', '${s.userId ? s.userId.name : ''}', '${s.userId ? s.userId.email : ''}', '${s.rollNo}', '${s.department}', '${s.semester}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${s._id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function addStudent() {
    const data = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        password: document.getElementById('studentPassword').value || '123456',
        rollNo: document.getElementById('studentRollNo').value,
        department: document.getElementById('studentDept').value,
        semester: parseInt(document.getElementById('studentSemester').value),
        phone: document.getElementById('studentPhone').value
    };

    const result = await apiCall('/admin/students', 'POST', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('addStudentModal');
        loadAllStudents();
    } else {
        showAlert(result.data.message || 'Error adding student', 'error');
    }
}

function editStudent(id, name, email, rollNo, dept, semester) {
    document.getElementById('editStudentId').value = id;
    document.getElementById('editStudentName').value = name;
    document.getElementById('editStudentEmail').value = email;
    document.getElementById('editStudentRollNo').value = rollNo;
    document.getElementById('editStudentDept').value = dept;
    document.getElementById('editStudentSemester').value = semester;
    openModal('editStudentModal');
}

async function updateStudent() {
    const id = document.getElementById('editStudentId').value;
    const data = {
        name: document.getElementById('editStudentName').value,
        email: document.getElementById('editStudentEmail').value,
        rollNo: document.getElementById('editStudentRollNo').value,
        department: document.getElementById('editStudentDept').value,
        semester: parseInt(document.getElementById('editStudentSemester').value)
    };

    const result = await apiCall(`/admin/students/${id}`, 'PUT', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('editStudentModal');
        loadAllStudents();
    } else {
        showAlert(result.data.message || 'Error updating', 'error');
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    const result = await apiCall(`/admin/students/${id}`, 'DELETE');

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadAllStudents();
    } else {
        showAlert(result.data.message || 'Error deleting', 'error');
    }
}

// ============================================
// MANAGE TEACHERS
// ============================================
async function loadAllTeachers() {
    const result = await apiCall('/admin/teachers');

    if (result && result.ok) {
        const tbody = document.getElementById('teachersTable');
        if (!tbody) return;

        if (result.data.teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No teachers found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.teachers.map(t => `
            <tr>
                <td>${t.userId ? t.userId.name : 'N/A'}</td>
                <td>${t.userId ? t.userId.email : 'N/A'}</td>
                <td>${t.employeeId}</td>
                <td>${t.department}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-warning" onclick="editTeacher('${t._id}', '${t.userId ? t.userId.name : ''}', '${t.userId ? t.userId.email : ''}', '${t.employeeId}', '${t.department}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTeacher('${t._id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function addTeacher() {
    const data = {
        name: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        password: document.getElementById('teacherPassword').value || '123456',
        employeeId: document.getElementById('teacherEmpId').value,
        department: document.getElementById('teacherDept').value,
        phone: document.getElementById('teacherPhone').value,
        qualification: document.getElementById('teacherQual').value
    };

    const result = await apiCall('/admin/teachers', 'POST', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('addTeacherModal');
        loadAllTeachers();
    } else {
        showAlert(result.data.message || 'Error adding teacher', 'error');
    }
}

function editTeacher(id, name, email, empId, dept) {
    document.getElementById('editTeacherId').value = id;
    document.getElementById('editTeacherName').value = name;
    document.getElementById('editTeacherEmail').value = email;
    document.getElementById('editTeacherEmpId').value = empId;
    document.getElementById('editTeacherDept').value = dept;
    openModal('editTeacherModal');
}

async function updateTeacher() {
    const id = document.getElementById('editTeacherId').value;
    const data = {
        name: document.getElementById('editTeacherName').value,
        email: document.getElementById('editTeacherEmail').value,
        employeeId: document.getElementById('editTeacherEmpId').value,
        department: document.getElementById('editTeacherDept').value
    };

    const result = await apiCall(`/admin/teachers/${id}`, 'PUT', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('editTeacherModal');
        loadAllTeachers();
    } else {
        showAlert(result.data.message || 'Error updating', 'error');
    }
}

async function deleteTeacher(id) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    const result = await apiCall(`/admin/teachers/${id}`, 'DELETE');

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadAllTeachers();
    } else {
        showAlert(result.data.message || 'Error deleting', 'error');
    }
}

// ============================================
// MANAGE SUBJECTS
// ============================================
async function loadAllSubjects() {
    const result = await apiCall('/admin/subjects');

    if (result && result.ok) {
        const tbody = document.getElementById('subjectsTable');
        if (!tbody) return;

        if (result.data.subjects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No subjects found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.subjects.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.code}</td>
                <td>${s.department}</td>
                <td>Sem ${s.semester}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-danger" onclick="deleteSubject('${s._id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function addSubject() {
    const data = {
        name: document.getElementById('subjectName').value,
        code: document.getElementById('subjectCode').value,
        department: document.getElementById('subjectDept').value,
        semester: parseInt(document.getElementById('subjectSemester').value)
    };

    const result = await apiCall('/admin/subjects', 'POST', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('addSubjectModal');
        loadAllSubjects();
    } else {
        showAlert(result.data.message || 'Error adding subject', 'error');
    }
}

async function deleteSubject(id) {
    if (!confirm('Delete this subject?')) return;
    const result = await apiCall(`/admin/subjects/${id}`, 'DELETE');
    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadAllSubjects();
    }
}

// ============================================
// MANAGE DEPARTMENTS
// ============================================
async function loadAllDepartments() {
    const result = await apiCall('/admin/departments');

    if (result && result.ok) {
        const tbody = document.getElementById('departmentsTable');
        if (!tbody) return;

        if (result.data.departments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No departments found</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.departments.map(d => `
            <tr>
                <td>${d.name}</td>
                <td>${d.code}</td>
                <td>${d.hodName || 'N/A'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-danger" onclick="deleteDepartment('${d._id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function addDepartment() {
    const data = {
        name: document.getElementById('deptName').value,
        code: document.getElementById('deptCode').value,
        hodName: document.getElementById('deptHod').value
    };

    const result = await apiCall('/admin/departments', 'POST', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('addDeptModal');
        loadAllDepartments();
    }
}

async function deleteDepartment(id) {
    if (!confirm('Delete this department?')) return;
    const result = await apiCall(`/admin/departments/${id}`, 'DELETE');
    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadAllDepartments();
    }
}

// ============================================
// TIMETABLE
// ============================================
async function loadTimetable() {
    const dept = document.getElementById('ttDepartment') ? document.getElementById('ttDepartment').value : '';
    const sem = document.getElementById('ttSemester') ? document.getElementById('ttSemester').value : '';

    let query = '?';
    if (dept) query += `department=${dept}&`;
    if (sem) query += `semester=${sem}`;

    const result = await apiCall(`/admin/timetable${query}`);

    if (result && result.ok) {
        const tbody = document.getElementById('timetableTable');
        if (!tbody) return;

        if (result.data.timetable.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No timetable entries</td></tr>';
            return;
        }

        let html = '';
        result.data.timetable.forEach(t => {
            const periods = t.periods ? t.periods.map(p => `${p.time}: ${p.subject} (${p.teacher})`).join('<br>') : 'No periods';
            html += `
                <tr>
                    <td>${t.department}</td>
                    <td>Sem ${t.semester}</td>
                    <td>${t.day}</td>
                    <td style="font-size:12px;">${periods}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteTimetable('${t._id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}

async function createTimetable() {
    const department = document.getElementById('newTtDept').value;
    const semester = parseInt(document.getElementById('newTtSem').value);
    const day = document.getElementById('newTtDay').value;

    const periodRows = document.querySelectorAll('.period-row');
    const periods = [];
    periodRows.forEach(row => {
        const time = row.querySelector('.period-time').value;
        const subject = row.querySelector('.period-subject').value;
        const teacher = row.querySelector('.period-teacher').value;
        if (time && subject) {
            periods.push({ time, subject, teacher });
        }
    });

    if (!department || !day || periods.length === 0) {
        showAlert('Please fill all fields and add at least one period!', 'error');
        return;
    }

    const result = await apiCall('/admin/timetable', 'POST', {
        department, semester, day, periods
    });

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        closeModal('addTimetableModal');
        loadTimetable();
    }
}

async function deleteTimetable(id) {
    if (!confirm('Delete this timetable entry?')) return;
    const result = await apiCall(`/admin/timetable/${id}`, 'DELETE');
    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadTimetable();
    }
}

function addPeriodRow() {
    const container = document.getElementById('periodsContainer');
    const row = document.createElement('div');
    row.className = 'period-row';
    row.style.cssText = 'display:flex; gap:8px; margin-bottom:8px;';
    row.innerHTML = `
        <input type="text" class="period-time" placeholder="Time (9:00-10:00)" style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
        <input type="text" class="period-subject" placeholder="Subject" style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
        <input type="text" class="period-teacher" placeholder="Teacher" style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
        <button type="button" onclick="this.parentElement.remove()" class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

// ============================================
// NOTIFICATIONS
// ============================================
async function loadNotifications() {
    const result = await apiCall('/admin/notifications');

    if (result && result.ok) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        if (result.data.notifications.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-bell fa-3x"></i></div><p>No notifications sent yet</p></div>';
            return;
        }

        container.innerHTML = result.data.notifications.map(n => `
            <div class="notification-item">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>${n.title}</h4>
                    <button class="btn btn-sm btn-danger" onclick="deleteNotification('${n._id}')"><i class="fas fa-trash"></i></button>
                </div>
                <p>${n.message}</p>
                <span class="time">To: ${n.targetRole} | ${formatDate(n.createdAt)}</span>
            </div>
        `).join('');
    }
}

async function sendNotification() {
    const data = {
        title: document.getElementById('notifTitle').value,
        message: document.getElementById('notifMessage').value,
        targetRole: document.getElementById('notifTarget').value
    };

    if (!data.title || !data.message) {
        showAlert('Please fill title and message!', 'error');
        return;
    }

    const result = await apiCall('/admin/notifications', 'POST', data);

    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        document.getElementById('notifForm').reset();
        loadNotifications();
    }
}

async function deleteNotification(id) {
    if (!confirm('Delete this notification?')) return;
    const result = await apiCall(`/admin/notifications/${id}`, 'DELETE');
    if (result && result.ok) {
        showAlert(result.data.message, 'success');
        loadNotifications();
    }
}

// ============================================
// ANALYTICS
// ============================================
async function loadAnalytics() {
    const result = await apiCall('/admin/analytics');

    if (result && result.ok) {
        const { studentsByDept, teachersByDept, totals } = result.data;

        document.getElementById('analyticStudents').textContent = totals.totalStudents;
        document.getElementById('analyticTeachers').textContent = totals.totalTeachers;
        document.getElementById('analyticSubjects').textContent = totals.totalSubjects;
        document.getElementById('analyticDepts').textContent = totals.totalDepartments;

        const chartContainer = document.getElementById('studentsChart');
        if (chartContainer) {
            if (studentsByDept.length === 0) {
                chartContainer.innerHTML = '<p class="empty-state">No data available</p>';
            } else {
                const maxCount = Math.max(...studentsByDept.map(d => d.count));
                chartContainer.innerHTML = studentsByDept.map(d => `
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                        <span style="width:120px; font-size:13px; font-weight:600;">${d._id || 'N/A'}</span>
                        <div style="flex:1; background:#e2e8f0; border-radius:6px; height:28px; overflow:hidden;">
                            <div style="width:${(d.count/maxCount)*100}%; background:linear-gradient(90deg, #2563eb, #1e40af); height:100%; border-radius:6px; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; color:white; font-size:12px; font-weight:600;">${d.count}</div>
                        </div>
                    </div>
                `).join('');
            }
        }

        const teacherChart = document.getElementById('teachersChart');
        if (teacherChart) {
            if (teachersByDept.length === 0) {
                teacherChart.innerHTML = '<p class="empty-state">No data available</p>';
            } else {
                const maxT = Math.max(...teachersByDept.map(d => d.count));
                teacherChart.innerHTML = teachersByDept.map(d => `
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                        <span style="width:120px; font-size:13px; font-weight:600;">${d._id || 'N/A'}</span>
                        <div style="flex:1; background:#e2e8f0; border-radius:6px; height:28px; overflow:hidden;">
                            <div style="width:${(d.count/maxT)*100}%; background:linear-gradient(90deg, #16a34a, #15803d); height:100%; border-radius:6px; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; color:white; font-size:12px; font-weight:600;">${d.count}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
}

// ============================================
// MODAL HELPERS
// ============================================
function openModal(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'addTimetableModal') {
        initializeDefaultPeriods();
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function initializeDefaultPeriods() {
    const container = document.getElementById('periodsContainer');
    if (!container) return;

    // Default times with 1-hour gaps
    const defaultTimes = [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00"
    ];

    container.innerHTML = defaultTimes.map((time) => `
        <div class="period-row" style="display:flex; gap:8px; margin-bottom:8px;">
            <input type="text" class="period-time" placeholder="Time" value="${time}" style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
            <input type="text" class="period-subject" placeholder="Subject Name / Code" required style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
            <input type="text" class="period-teacher" placeholder="Teacher Name" required style="flex:1; padding:8px; border:1px solid #d1d5db; border-radius:6px;">
            <button type="button" onclick="this.parentElement.remove()" class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}
