import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

/* ── SVG Icons (inline to avoid external deps) ─────────────── */
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/* Social brand icons */
const GoogleIcon = () => (
    <svg viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 48 48">
        <path fill="#1877F2" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" />
        <path fill="#fff" d="M26.572 25.5h3.428l.5-3.5h-3.928v-2.034c0-1.497.436-2.466 2.215-2.466H31V14.13A30.252 30.252 0 0 0 27.607 14c-3.363 0-5.607 2.091-5.607 5.908V22h-3v3.5h3V35h4.572V25.5z" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 48 48">
        <path fill="#555" d="M24 4C12.954 4 4 12.954 4 24c0 8.86 5.74 16.37 13.71 19.025.55.076 1.29-.236 1.29-.873v-3.037c-5.588 1.213-6.77-2.695-6.77-2.695-.914-2.323-2.232-2.941-2.232-2.941-1.824-1.247.138-1.222.138-1.222 2.017.142 3.079 2.071 3.079 2.071 1.793 3.073 4.702 2.184 5.849 1.67.182-1.299.701-2.184 1.277-2.686-4.46-.507-9.15-2.23-9.15-9.928 0-2.193.784-3.986 2.071-5.39-.207-.508-.898-2.55.197-5.313 0 0 1.689-.541 5.532 2.06A19.293 19.293 0 0 1 24 13.38c1.71.008 3.43.231 5.035.677 3.84-2.601 5.526-2.06 5.526-2.06 1.097 2.763.406 4.805.2 5.313 1.289 1.404 2.069 3.197 2.069 5.39 0 7.717-4.698 9.414-9.172 9.91.721.622 1.365 1.847 1.365 3.723v5.52c0 .64.284.96 1.3.876C38.265 40.363 44 32.855 44 24 44 12.954 35.046 4 24 4z" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="16" height="16">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

/* ═══════════════════════════════════════════════════════════════
   SignupCard Component
   ═══════════════════════════════════════════════════════════════ */
export default function SignupCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error'|'success', text: '' }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);

        // Validation
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);

        try {
            await registerUser(username.trim(), email.trim(), password, confirmPassword);

            setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login…' });

            // Redirect to login after a brief pause
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="signup-glass-card" id="signup-card">
            {/* Header */}
            <div className="signup-card-header">
                <h2 className="signup-card-title">Signup</h2>
                <p className="signup-card-subtitle">Just some details to get you in.!</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`signup-message signup-message-${message.type}`} role="alert" id="signup-message">
                    {message.type === 'error' ? <AlertIcon /> : <CheckIcon />}
                    {message.text}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" id="signup-form">
                {/* Username */}
                <div className="signup-form-group">
                    <div className="signup-input-wrapper">
                        <input
                            id="signup-username-input"
                            className="signup-form-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            disabled={loading}
                        />
                        <span className="signup-input-icon"><UserIcon /></span>
                    </div>
                </div>

                {/* Email / Phone */}
                <div className="signup-form-group">
                    <div className="signup-input-wrapper">
                        <input
                            id="signup-email-input"
                            className="signup-form-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                        />
                        <span className="signup-input-icon"><MailIcon /></span>
                    </div>
                </div>

                {/* Password */}
                <div className="signup-form-group">
                    <div className="signup-input-wrapper">
                        <input
                            id="signup-password-input"
                            className="signup-form-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={loading}
                        />
                        <span className="signup-input-icon"><LockIcon /></span>
                        <button
                            type="button"
                            className="signup-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            id="signup-password-toggle"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="signup-form-group">
                    <div className="signup-input-wrapper">
                        <input
                            id="signup-confirm-password-input"
                            className="signup-form-input"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={loading}
                        />
                        <span className="signup-input-icon"><ShieldIcon /></span>
                        <button
                            type="button"
                            className="signup-password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            id="signup-confirm-password-toggle"
                        >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-signup"
                    disabled={loading}
                    id="signup-submit-btn"
                >
                    {loading && <span className="signup-spinner" />}
                    {loading ? 'Creating account…' : 'Signup'}
                </button>
            </form>

            {/* Divider */}
            <div className="signup-divider">Or</div>

            {/* Social Login */}
            <div className="signup-social-login" id="signup-social-section">
                <button className="signup-social-btn" aria-label="Sign up with Google" id="signup-google-btn">
                    <GoogleIcon />
                </button>
                <button className="signup-social-btn" aria-label="Sign up with Facebook" id="signup-facebook-btn">
                    <FacebookIcon />
                </button>
                <button className="signup-social-btn" aria-label="Sign up with GitHub" id="signup-github-btn">
                    <GitHubIcon />
                </button>
            </div>

            {/* Footer */}
            <div className="signup-card-footer">
                <p className="login-text">
                    Already Registered?{' '}
                    <a onClick={() => navigate('/login')} className="login-link" id="login-link">Login</a>
                </p>
                <div className="signup-footer-links">
                    <a href="#terms">Terms &amp; Conditions</a>
                    <a href="#support">Support</a>
                    <a href="#care">Customer Care</a>
                </div>
            </div>
        </div>
    );
}
