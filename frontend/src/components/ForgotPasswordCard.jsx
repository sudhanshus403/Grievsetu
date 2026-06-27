import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── SVG Icons ──────────────────────────────────────────────── */
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
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
   ForgotPasswordCard Component
   ═══════════════════════════════════════════════════════════════ */
export default function ForgotPasswordCard() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error'|'success', text: '' }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Please enter your email address.' });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);

        try {
            // TODO: Connect to backend reset password endpoint
            // await resetPassword(email.trim());

            // Simulated success for now
            await new Promise(resolve => setTimeout(resolve, 1500));

            setMessage({ type: 'success', text: 'Password reset link has been sent to your email!' });
        } catch (err) {
            const detail =
                err.response?.data?.detail ||
                err.message ||
                'Something went wrong. Please try again.';
            setMessage({ type: 'error', text: detail });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-glass-card" id="forgot-password-card">
            {/* Header */}
            <div className="forgot-card-header">
                <h2 className="forgot-card-title">Forgot Password ?</h2>
                <p className="forgot-card-subtitle">Please enter you're email</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`forgot-message forgot-message-${message.type}`} role="alert" id="forgot-message">
                    {message.type === 'error' ? <AlertIcon /> : <CheckIcon />}
                    {message.text}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" id="forgot-password-form">
                {/* Email */}
                <div className="forgot-form-group">
                    <div className="forgot-input-wrapper">
                        <input
                            id="forgot-email-input"
                            className="forgot-form-input"
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                        />
                        <span className="forgot-input-icon"><MailIcon /></span>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-reset-password"
                    disabled={loading}
                    id="reset-password-btn"
                >
                    {loading && <span className="forgot-spinner" />}
                    {loading ? 'Sending…' : 'Reset Password'}
                </button>
            </form>

            {/* Footer */}
            <div className="forgot-card-footer">
                <p className="forgot-signup-text">
                    Don't have an account ?{' '}
                    <a onClick={() => navigate('/signup')} className="forgot-signup-link" id="forgot-signup-link">Signup</a>
                </p>
                <div className="forgot-footer-links">
                    <a href="#terms">Terms &amp; Conditions</a>
                    <a href="#support">Support</a>
                    <a href="#care">Customer Care</a>
                </div>
            </div>
        </div>
    );
}
