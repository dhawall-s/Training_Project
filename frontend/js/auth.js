const BASE_URL = 'http://localhost:5000';
const API_URL = BASE_URL + '/api';

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = 'alert';

    if (type === 'success') {
        alertBox.classList.add('alert-success');
    } else if (type === 'error') {
        alertBox.classList.add('alert-error');
    } else {
        alertBox.classList.add('alert-info');
    }

    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function checkAuth(requiredRole) {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        window.location.href = '../login/login.html';
        return false;
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.href = '../login/login.html';
        return false;
    }

    return true;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login/login.html';
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(API_URL + endpoint, options);
        const data = await response.json();

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

async function apiCallWithFile(endpoint, formData) {
    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken()

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

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function setUserInfo() {
    const user = getUser();
    if (!user) return;

    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
}
