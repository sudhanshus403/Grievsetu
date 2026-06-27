import { useState, useEffect } from 'react';
import '../styles/profile.css';
import { getUser, getUserId, api } from '../services/authService';

const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const ActivityIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LockSmallIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const FONT_SIZE_MAP = {
    small: '14px',
    medium: '16px',
    large: '18px'
};

export default function ProfilePage({ onUpdateUsername, onUpdateAvatar }) {
    const [activeTab, setActiveTab] = useState('profile');
    
    // Preferences State
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('accentColor') || '#3b82f6';
    });
    
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', accentColor);
        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    return (
        <div className="profile-page-wrapper fade-in">
            <div className="profile-header">
                <h2>Account Settings</h2>
                <p>Manage your profile, security, and preferences</p>
            </div>

            <div className="profile-container">
                <aside className="profile-sidebar">
                    <button 
                        className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <UserIcon /> Profile
                    </button>
                    <button 
                        className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <LockIcon /> Security
                    </button>
                    <button 
                        className={`profile-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <SettingsIcon /> Preferences
                    </button>
                    <button 
                        className={`profile-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        <ActivityIcon /> Activity
                    </button>
                </aside>

                <main className="profile-content">
                    {activeTab === 'profile' && <ProfileTab onUpdateUsername={onUpdateUsername} onUpdateAvatar={onUpdateAvatar} />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'preferences' && <PreferencesTab accentColor={accentColor} setAccentColor={setAccentColor} />}
                    {activeTab === 'activity' && <ActivityTab />}
                </main>
            </div>
        </div>
    );
}

// --- Profile Tab ---
function ProfileTab({ onUpdateUsername, onUpdateAvatar }) {
    const userId = getUserId();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        photoPreview: null,
        fullName: getUser() || 'User',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [saveMsg, setSaveMsg] = useState('');

    // Fetch profile from backend
    useEffect(() => {
        if (!userId) return;
        api.get(`/profile/${userId}`)
            .then(res => {
                const d = res.data;
                setProfile({
                    photoPreview: d.profile_pic ? `${api.defaults.baseURL}/${d.profile_pic}` : null,
                    fullName: d.name,
                    email: d.email,
                    phone: d.phone ? d.phone.replace(/^\+91\s?/, '') : '',
                    address: d.address || ''
                });
            })
            .catch(err => console.error(err));
    }, [userId]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setProfile(p => ({ ...p, photoPreview: previewUrl }));

        // Upload to backend
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post(`/upload_profile_pic/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const serverUrl = `${api.defaults.baseURL}/${res.data.file_path}`;
            setProfile(p => ({ ...p, photoPreview: serverUrl }));
            if (onUpdateAvatar) onUpdateAvatar(serverUrl);
        } catch (err) {
            console.error('Photo upload failed', err);
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!profile.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (profile.phone && !/^\d{10}$/.test(profile.phone)) newErrors.phone = 'Enter 10 digit phone number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await api.put(`/profile/${userId}`, {
                name: profile.fullName,
                phone: profile.phone ? `+91${profile.phone}` : '',
                address: profile.address
            });
            setIsEditing(false);
            setSaveMsg('Profile updated successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
            if (onUpdateUsername) onUpdateUsername(profile.fullName);
            localStorage.setItem('grievsetu_user', profile.fullName);
        } catch (err) {
            console.error('Profile save failed', err);
        }
    };

    return (
        <div className="tab-pane slide-up">
            <div className="tab-header">
                <h3>Personal Information</h3>
                {!isEditing && (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </div>

            {saveMsg && <div className="save-success-msg">{saveMsg}</div>}

            <div className="profile-photo-section">
                <div className="photo-wrapper">
                    {profile.photoPreview ? (
                        <img src={profile.photoPreview} alt="Profile" className="profile-photo" />
                    ) : (
                        <div className="profile-photo-placeholder">
                            {profile.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label className="photo-upload-btn">
                        <CameraIcon />
                        <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                    </label>
                </div>
                <div className="photo-info">
                    <h4>Profile Photo</h4>
                    <p>PNG, JPEG under 5MB</p>
                </div>
            </div>

            <div className="profile-form-grid">
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        value={profile.fullName} 
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        disabled={!isEditing}
                        className={errors.fullName ? 'error-input' : ''}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                    <label>
                        Email Address
                        <span className="field-locked-badge"><LockSmallIcon /> Cannot be changed</span>
                    </label>
                    <input 
                        type="email" 
                        value={profile.email} 
                        disabled={true}
                        className="locked-field"
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-wrapper">
                        <div className="phone-prefix">
                            <span className="india-flag">🇮🇳</span>
                            <span className="prefix-text">+91</span>
                        </div>
                        <input 
                            type="tel" 
                            value={profile.phone} 
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setProfile({ ...profile, phone: val });
                            }}
                            disabled={!isEditing}
                            placeholder="9876543210"
                            className={`phone-input ${errors.phone ? 'error-input' : ''}`}
                            maxLength={10}
                        />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input 
                        type="text" 
                        value={profile.address} 
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="form-actions">
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                </div>
            )}
        </div>
    );
}

// --- Security Tab (2FA removed) ---
function SecurityTab() {
    const userId = getUserId();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [strength, setStrength] = useState(0);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setStrength(score);
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPasswords({ ...passwords, new: val });
        calculateStrength(val);
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current) {
            setMsg({ text: 'Please enter current password', type: 'error' });
            return;
        }
        if (passwords.new.length < 6) {
            setMsg({ text: 'New password must be at least 6 characters', type: 'error' });
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setMsg({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        try {
            await api.put(`/change_password/${userId}`, {
                current_password: passwords.current,
                new_password: passwords.new
            });
            setMsg({ text: 'Password updated successfully!', type: 'success' });
            setPasswords({ current: '', new: '', confirm: '' });
            setStrength(0);
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        } catch (err) {
            const detail = err.response?.data?.detail || err.message || 'Failed to update password';
            setMsg({ text: detail, type: 'error' });
        }
    };

    const handleLogoutAllDevices = async () => {
        setLogoutLoading(true);
        try {
            await api.post(`/logout_all_devices/${userId}`);
            setMsg({ text: 'All other sessions have been logged out successfully!', type: 'success' });
            setShowLogoutConfirm(false);
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        } catch (err) {
            const detail = err.response?.data?.detail || err.message || 'Failed to logout devices';
            setMsg({ text: detail, type: 'error' });
            setShowLogoutConfirm(false);
        }
        setLogoutLoading(false);
    };

    return (
        <div className="tab-pane slide-up">
            <div className="tab-header">
                <h3>Security Settings</h3>
            </div>

            {msg.text && (
                <div className={`security-msg ${msg.type}`}>{msg.text}</div>
            )}

            <div className="security-card">
                <h4>Change Password</h4>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} placeholder="Enter current password" />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={passwords.new} onChange={handlePasswordChange} placeholder="Enter new password" />
                    <div className="password-strength">
                        <div className={`strength-bar ${strength >= 1 ? 'active' : ''} ${strength === 1 ? 'weak' : strength === 2 ? 'fair' : strength >= 3 ? 'good' : ''}`}></div>
                        <div className={`strength-bar ${strength >= 2 ? 'active' : ''} ${strength === 2 ? 'fair' : strength >= 3 ? 'good' : ''}`}></div>
                        <div className={`strength-bar ${strength >= 3 ? 'active' : ''} ${strength >= 3 ? 'good' : ''}`}></div>
                        <div className={`strength-bar ${strength >= 4 ? 'active' : ''} ${strength >= 4 ? 'strong' : ''}`}></div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} placeholder="Confirm new password" />
                </div>
                <button className="btn-save" style={{marginTop: '1rem'}} onClick={handleUpdatePassword}>Update Password</button>
            </div>

            <div className="security-card danger-zone">
                <div className="flex-between">
                    <div>
                        <h4 className="text-danger">Active Sessions</h4>
                        <p className="text-muted">Log out of all other active sessions on other devices.</p>
                    </div>
                    <button className="btn-danger" onClick={() => setShowLogoutConfirm(true)}>Log Out All Devices</button>
                </div>
            </div>

            {/* Logout All Devices Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h3>Log Out All Devices?</h3>
                        <p>This will invalidate all active sessions on other devices. You will stay logged in on this device.</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="btn-danger" onClick={handleLogoutAllDevices} disabled={logoutLoading}>
                                {logoutLoading ? 'Logging out...' : 'Log Out All Devices'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Preferences Tab (SMS Alerts removed, Grievance Defaults removed, Font size fixed) ---
function PreferencesTab({ accentColor, setAccentColor }) {
    const [notif, setNotif] = useState({ email: true, push: true });
    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem('grievsetu_fontsize') || 'medium';
    });

    // Apply font size in real time
    useEffect(() => {
        document.documentElement.style.setProperty('--base-font-size', FONT_SIZE_MAP[fontSize]);
        document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSize];
        localStorage.setItem('grievsetu_fontsize', fontSize);
    }, [fontSize]);

    return (
        <div className="tab-pane slide-up">
            <div className="tab-header">
                <h3>Preferences</h3>
            </div>

            <div className="pref-section">
                <h4>Theme Customization</h4>
                <div className="pref-row flex-between">
                    <span>Accent Color</span>
                    <div className="color-picker-wrapper">
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="color-picker" />
                    </div>
                </div>
                <div className="pref-row flex-between">
                    <span>Font Size</span>
                    <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="pref-select">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>

            <div className="pref-section">
                <h4>Notifications</h4>
                <div className="pref-row flex-between">
                    <span>Email Notifications</span>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={notif.email} onChange={() => setNotif({...notif, email: !notif.email})} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="pref-row flex-between">
                    <span>Push Notifications</span>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={notif.push} onChange={() => setNotif({...notif, push: !notif.push})} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}

// --- Activity Tab ---
function ActivityTab() {
    const userId = getUserId();
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;
        api.get(`/dashboard/${userId}`)
            .then(res => setStats({ total: res.data.total, pending: res.data.pending, resolved: res.data.resolved }))
            .catch(err => console.error(err));
        
        api.get(`/notifications/${userId}`)
            .then(res => setNotifications(res.data.slice(0, 5)))
            .catch(err => console.error(err));
    }, [userId]);

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <CheckIcon />;
            case 'security': return <LockIcon />;
            case 'info': return <UserIcon />;
            default: return <ActivityIcon />;
        }
    };

    function timeAgo(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 172800) return 'Yesterday';
        return `${Math.floor(diff / 86400)} days ago`;
    }

    return (
        <div className="tab-pane slide-up">
            <div className="tab-header">
                <h3>Your Activity</h3>
            </div>

            <div className="activity-stats-grid">
                <div className="activity-stat-card">
                    <div className="stat-num">{stats.total}</div>
                    <div className="stat-label">Total Grievances</div>
                </div>
                <div className="activity-stat-card warning">
                    <div className="stat-num">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="activity-stat-card success">
                    <div className="stat-num">{stats.resolved}</div>
                    <div className="stat-label">Resolved</div>
                </div>
            </div>

            <div className="activity-timeline-wrapper">
                <h4>Recent Activity</h4>
                <div className="activity-timeline">
                    {notifications.length === 0 ? (
                        <p style={{ color: '#94a3b8', padding: '1rem 0' }}>No recent activity to show.</p>
                    ) : (
                        notifications.map((n) => (
                            <div className="timeline-item" key={n.id}>
                                <div className={`timeline-icon ${n.type}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="timeline-content">
                                    <p className="timeline-text">{n.title}</p>
                                    <span className="timeline-date">{timeAgo(n.created_at)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
