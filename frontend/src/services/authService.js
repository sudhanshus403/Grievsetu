import axios from 'axios';

// ─── Configurable API base URL ───────────────────────────────────
// In development Vite proxies /api → http://localhost:8000
// In production, set VITE_API_URL to your real backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15 second timeout
});

// ─── Request interceptor: attach JWT token automatically ─────────
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response interceptor: normalise errors ──────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network / CORS / timeout errors (no response from server)
        if (!error.response) {
            const msg =
                error.code === 'ECONNABORTED'
                    ? 'Request timed out. Please try again.'
                    : 'Cannot reach the server. Make sure the backend is running on ' + API_BASE_URL;
            return Promise.reject(new Error(msg));
        }

        // Server returned an error response
        const detail =
            error.response.data?.detail ||
            error.response.data?.message ||
            `Server error (${error.response.status})`;
        return Promise.reject(new Error(detail));
    }
);

// ─── Auth API calls ──────────────────────────────────────────────

/**
 * Login with email and password.
 * Backend expects: POST /login  { email: string, password: string }
 * Returns: { message, token, user_id, role, name, email }
 */
export async function loginUser(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
}

/**
 * Register a new user.
 * Backend expects: POST /register  { name, email, password, confirm_password }
 * Returns: { message: string }
 */
export async function registerUser(name, email, password, confirm_password) {
    const response = await api.post('/register', { name, email, password, confirm_password });
    return response.data;
}

// ─── Token helpers ───────────────────────────────────────────────

const TOKEN_KEY = 'grievsetu_auth_token';
const USER_KEY = 'grievsetu_user';
const USER_ID_KEY = 'grievsetu_user_id';
const USER_ROLE_KEY = 'grievsetu_user_role';
const USER_EMAIL_KEY = 'grievsetu_user_email';

export function saveToken(token, username, userId, role, email) {
    localStorage.setItem(TOKEN_KEY, token);
    if (username) localStorage.setItem(USER_KEY, username);
    if (userId) localStorage.setItem(USER_ID_KEY, String(userId));
    if (role) localStorage.setItem(USER_ROLE_KEY, role);
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
    return localStorage.getItem(USER_KEY);
}

export function getUserId() {
    return localStorage.getItem(USER_ID_KEY);
}

export function getUserRole() {
    return localStorage.getItem(USER_ROLE_KEY);
}

export function getUserEmail() {
    return localStorage.getItem(USER_EMAIL_KEY);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}

// Export the axios instance so other pages can reuse it for authenticated calls
export { api };
