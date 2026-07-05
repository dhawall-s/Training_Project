// ============================================
// auth.js - Common Authentication Functions
// ============================================
// WHY: These functions are used across ALL pages
// - showAlert: Shows success/error messages
// - checkAuth: Checks if user is logged in
// - logout: Clears token and redirects to login
// - getToken: Gets JWT token from localStorage
// - apiCall: Makes authenticated API calls

// ---- Backend Base URL and API URL ----
// WHY: We use a static base URL pointing to our local Express server (running on port 5000)
const BASE_URL = 'http://localhost:5000';
const API_URL = BASE_URL + '/api';

// ============================================
// SHOW ALERT - Display success/error message
// ============================================
// WHY: Instead of using alert(), we show a nice colored message box
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = 'alert'; // Reset classes

    // Add appropriate color class
    if (type === 'success') {
        alertBox.classList.add('alert-success');
    } else if (type === 'error') {
        alertBox.classList.add('alert-error');
    } else {
        alertBox.classList.add('alert-info');
    }

    alertBox.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

// ============================================
// GET TOKEN - Get JWT token from localStorage
// ============================================
// WHY: Every authenticated API call needs the token
function getToken() {
    return localStorage.getItem('token');
}

// ============================================
// GET USER - Get logged-in user info
// ============================================
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// ============================================
// CHECK AUTH - Check if user is logged in
// ============================================
// WHY: Protected pages should redirect to login if not authenticated
// role parameter ensures only correct role can access
function checkAuth(requiredRole) {
    const token = getToken();
    const user = getUser();

    // If no token or no user, redirect to login
    if (!token || !user) {
        window.location.href = '../login/login.html';
        return false;
    }

    // If role doesn't match, redirect to correct dashboard
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = '../login/login.html';
        return false;
    }

    return true;
}

// ============================================
// LOGOUT - Clear token and redirect to login
// ============================================
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login/login.html';
}

// ============================================
// API CALL - Make authenticated API requests
// ============================================
// WHY: A helper function so we don't have to write fetch() code everywhere
// It automatically adds the JWT token to every request
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        }
    };

    // If there's data to send (POST/PUT), add it to body
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(API_URL + endpoint, options);
        const data = await response.json();

        // If token expired or invalid, redirect to login
        if (response.status === 401) {
            logout();
            return null;
        }

        return { ok: response.ok, data };
    } catch (error) {
        console.error('API Error:', error);
        return { ok: false, data: { message: 'Cannot connect to server!' } };
    }
}

// ============================================
// API CALL WITH FILE - For file uploads
// ============================================
// WHY: File uploads need FormData instead of JSON
async function apiCallWithFile(endpoint, formData) {
    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken()
                // WHY no Content-Type: Browser auto-sets it with boundary for FormData
            },
            body: formData
        });

        const data = await response.json();

        if (response.status === 401) {
            logout();
            return null;
        }

        return { ok: response.ok, data };
    } catch (error) {
        console.error('Upload Error:', error);
        return { ok: false, data: { message: 'Upload failed!' } };
    }
}

// ============================================
// FORMAT DATE - Convert date to readable format
// ============================================
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ============================================
// SET USER NAME IN SIDEBAR
// ============================================
function setUserInfo() {
    const user = getUser();
    if (!user) return;

    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
}
