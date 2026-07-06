# 🎓 College ERP Portal

A complete, fully functional, and easy-to-understand **College ERP Portal** designed for learners and college projects. It has separate dashboards for **Admin**, **Teachers**, and **Students** with seamless role-based authentication and secure data flow.

---

## 🚀 Key Features

### 🔐 Authentication & User Management
- **One Login Page**: No role selection dropdown needed! The system automatically detects whether you are an Admin, Teacher, or Student and redirects you to the correct dashboard.
- **Admin-Only Signup**: Students and Teachers cannot register themselves. Only the Admin can create, edit, or delete student and teacher accounts.
- **Hashed Passwords**: Password hashing using `bcryptjs` for maximum security.
- **JWT Authentication**: Secure login sessions with JSON Web Tokens.
- **Forgot Password**: Password reset using registered emails.
- **Auto-Admin Creation**: On first database connection, a default admin is automatically created (`admin@erp.com` / `Admin@123`).

### 🏛️ Admin Dashboard
- **Total Counts**: Quick stats for Students, Teachers, Subjects, and Departments.
- **CRUD Operations**: Complete management (create, read, update, delete) for Students, Teachers, Subjects, and Departments.
- **Timetable Generator**: Admin can create weekly timetables. Selecting "Add Entry" pre-populates **5 period rows with a 1-hour time gap** (`09:00 - 10:00`, `10:00 - 11:00`, etc.) automatically.
- **Notifications**: Broadcast notice announcements to Students, Teachers, or Everyone.
- **Visual Analytics**: Interactive department-wise statistics shown in clear bar charts.

### 👨‍🏫 Teacher Dashboard
- **Attendance Management**: Mark student attendance daily using checkboxes (Checked = Present, Unchecked = Absent).
- **Study Notes Upload**: Upload notes in PDF format for students.
- **Assignments**: Upload assignments with descriptions and optional PDF files.
- **Marks Entry**: Enter internal/external/practical marks (out of 100) per student for any subject.
- **Students List**: View details of all students in their department.
- **Timetable**: View the weekly schedule for their department.

### 📚 Student Dashboard
- **Overview Card**: Instantly see your attendance percentage, upcoming assignments, and subjects count.
- **View Attendance**: Check daily present/absent status.
- **Assignments**: Download homework/assignments uploaded by teachers.
- **Study Notes**: View and download study notes (PDFs) uploaded by department teachers.
- **Academic Results**: View exam marks and auto-calculated letter grades.
- **Class Timetable**: View their weekly class schedule.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+, Vanilla, No Frameworks), Font Awesome v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Community Server (via Mongoose ODM) |
| **Auth** | JSON Web Token (JWT), BcryptJS |
| **Uploads** | Multer (for secure PDF notes and assignment file uploads) |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── config/db.js          # Database connection & default admin initialization
│   ├── controllers/          # Business logic for auth, student, teacher, admin
│   ├── middleware/auth.js     # JWT verification & role validation
│   ├── models/                # 11 Mongoose database models
│   ├── routes/                # Endpoint routing files
│   ├── uploads/               # Note/Assignment PDF uploads directory
│   ├── server.js              # Server entry point (runs on port 5000)
│   └── package.json           # Project dependencies
│
├── frontend/
│   ├── css/style.css          # Responsive design stylesheet
│   ├── js/
│   │   ├── auth.js            # Common API requests & session helpers
│   │   ├── student.js         # Student dashboard actions
│   │   ├── teacher.js         # Teacher dashboard actions
│   │   └── admin.js           # Admin dashboard actions
│   ├── login/
│   │   ├── login.html         # Login page (auto-detects role)
│   │   └── forgot-password.html# Password reset
│   ├── student/               # Student dashboard HTML files (7 pages)
│   ├── teacher/               # Teacher dashboard HTML files (8 pages)
│   ├── admin/                 # Admin dashboard HTML files (8 pages)
│   └── index.html             # Landing portal page
└── .gitignore                 # Files/folders to ignore in Git
```

---

## 🏁 How to Run

### Prerequisite
Make sure you have [Node.js](https://nodejs.org/) installed and [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on port `27017`.

### Step 1: Clone the Project
```bash
git clone https://github.com/dhawall-s/Training_Project.git
cd Training_Project
```

### Step 2: Start the Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
The backend will run on `http://localhost:5000`.

### Step 3: Open the Frontend
Simply open `frontend/index.html` in any web browser.
*(Alternatively, right-click `index.html` in VS Code and select "Open with Live Server".)*

---

## 🔑 Default Admin Login
When you run the backend for the first time, a default Admin account is automatically created:
- **Email**: `admin@erp.com`
- **Password**: `Admin@123`

You can log in with this account, navigate to **Manage Teachers** / **Manage Students**, and start adding users.
