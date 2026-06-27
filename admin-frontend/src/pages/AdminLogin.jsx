import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default function AdminLogin() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (form.password !== form.confirm_password) {
                    setMsg({ type: 'error', text: 'Passwords do not match' });
                    setLoading(false);
                    return;
                }
                await axios.post(`${API}/admin/register`, {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    confirm_password: form.confirm_password
                });
                setMsg({ type: 'success', text: 'Admin registered! Please login.' });
                setMode('login');
            } else {
                const res = await axios.post(`${API}/admin/login`, {
                    email: form.email,
                    password: form.password
                });
                localStorage.setItem('admin_token', res.data.token);
                localStorage.setItem('admin_name', res.data.name);
                localStorage.setItem('admin_id', res.data.user_id);
                setMsg({ type: 'success', text: 'Login successful!' });
                setTimeout(() => navigate('/dashboard'), 800);
            }
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.detail || 'Something went wrong' });
        }
        setLoading(false);
    };

    return (
        <div className="admin-login-page fade-in">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <div className="admin-logo-icon"><ShieldIcon /></div>
                    <div className="admin-logo-text">Griev<span>Setu</span> Admin</div>
                </div>

                <div className="admin-tab-toggle">
                    <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
                    <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign Up</button>
                </div>

                <h2 className="admin-login-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="admin-login-subtitle">{mode === 'login' ? 'Sign in to the admin panel' : 'Register a new admin account'}</p>

                {msg && <div className={`admin-login-msg ${msg.type}`}>{msg.text}</div>}

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="admin-form-group">
                            <label>Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Admin Name" required />
                        </div>
                    )}
                    <div className="admin-form-group">
                        <label>Email Address</label>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@grievsetu.gov.in" required />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Enter password" required />
                    </div>
                    {mode === 'signup' && (
                        <div className="admin-form-group">
                            <label>Confirm Password</label>
                            <input type="password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} placeholder="Confirm password" required />
                        </div>
                    )}
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
