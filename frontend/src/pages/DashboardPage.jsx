import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getUserId, removeToken, api } from '../services/authService';
import '../styles/dashboard.css';
import SubmitGrievancePage from './SubmitGrievancePage';
import MyGrievancesPage from './MyGrievancesPage';
import TrackGrievancesPage from './TrackGrievancesPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import NotificationsPage from './NotificationsPage';
import HelpPage from './HelpPage';

/* ── SVG Icons ──────────────────────────────────────────────── */
const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const SubmitIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="12" y2="12" /><line x1="15" y1="15" x2="12" y2="12" />
    </svg>
);
const GrievancesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);
const TrackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const NotifIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const ProfileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const ExternalLinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);
const ChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

/* Stat icons */
const TotalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);
const PendingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const ProgressIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const ResolvedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

/* Quick action icons */
const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
);
const HelpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const FeedbackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

/* ── Status label map ─────────────────────────────────────────── */
const statusLabels = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
};

/* ── Chart helper: build SVG paths from report data ─────────── */
function buildChart(reportData) {
    const CHART_LEFT = 40;
    const CHART_RIGHT = 540;
    const CHART_TOP = 50;
    const CHART_BOTTOM = 200;

    if (!reportData || reportData.length === 0) {
        // No data: flat line at y = bottom (count 0)
        const points = [
            { x: CHART_LEFT, y: CHART_BOTTOM },
            { x: CHART_RIGHT, y: CHART_BOTTOM },
        ];
        const linePath = `M ${CHART_LEFT} ${CHART_BOTTOM} L ${CHART_RIGHT} ${CHART_BOTTOM}`;
        const areaPath = linePath + ` L ${CHART_RIGHT} ${CHART_BOTTOM} L ${CHART_LEFT} ${CHART_BOTTOM} Z`;

        // Generate last 6 day labels
        const today = new Date();
        const xLabels = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i * 6);
            xLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return { points, linePath, areaPath, xLabels, yLabels: ['0', '0', '0', '0'], maxCount: 0 };
    }

    // Sort by date
    const sorted = [...reportData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const maxCount = Math.max(...sorted.map(d => d.count), 1);
    const yRange = CHART_BOTTOM - CHART_TOP;
    const xRange = CHART_RIGHT - CHART_LEFT;

    const points = sorted.map((d, i) => {
        const x = sorted.length === 1
            ? (CHART_LEFT + CHART_RIGHT) / 2
            : CHART_LEFT + (i / (sorted.length - 1)) * xRange;
        const y = CHART_BOTTOM - (d.count / maxCount) * yRange;
        return { x, y, count: d.count, date: d.date };
    });

    // Smooth curve
    const linePath = points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cpx1 = prev.x + (p.x - prev.x) / 3;
        const cpx2 = p.x - (p.x - prev.x) / 3;
        return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
    }).join(' ');

    const areaPath = linePath + ` L ${points[points.length - 1].x} ${CHART_BOTTOM} L ${points[0].x} ${CHART_BOTTOM} Z`;

    const xLabels = sorted.map(d => {
        const dt = new Date(d.date);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Y labels (4 ticks from max to 0)
    const step = Math.ceil(maxCount / 3);
    const yLabels = [String(step * 3), String(step * 2), String(step), '0'];

    return { points, linePath, areaPath, xLabels, yLabels, maxCount };
}

/* ═══════════════════════════════════════════════════════════════
   DashboardPage Component
   ═══════════════════════════════════════════════════════════════ */
/* ── Dropdown Menu Icons ──────────────────────────────────────── */
const ViewProfileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const UserSettingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const NotifDropdownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const HelpDropdownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default function DashboardPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(getUser() || 'User Name');
    const userId = getUserId();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef(null);

    // ── Dynamic data state ──────────────────────────────────
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, in_progress: 0 });
    const [recentGrievances, setRecentGrievances] = useState([]);
    const [reportData, setReportData] = useState([]);

    // ── Fetch dashboard data on mount ───────────────────────
    useEffect(() => {
        if (!userId) return;
        api.get(`/dashboard/${userId}`)
            .then(res => setStats(res.data))
            .catch(err => console.error('Dashboard stats error:', err));

        api.get(`/recent/${userId}`)
            .then(res => setRecentGrievances(res.data))
            .catch(err => console.error('Recent grievances error:', err));

        api.get(`/report/${userId}`)
            .then(res => setReportData(res.data))
            .catch(err => console.error('Report data error:', err));

        // Fetch profile pic
        api.get(`/profile/${userId}`)
            .then(res => { if (res.data.profile_pic) setAvatarUrl(`${api.defaults.baseURL}/${res.data.profile_pic}`); })
            .catch(() => {});
    }, [userId]);

    // ── Poll unread notification count ───────────────────────
    useEffect(() => {
        if (!userId) return;
        const fetchCount = () => {
            api.get(`/notifications/unread_count/${userId}`)
                .then(res => setUnreadCount(res.data.count))
                .catch(() => {});
        };
        fetchCount();
        const interval = setInterval(fetchCount, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    // ── Build chart from report data ────────────────────────
    const chart = useMemo(() => buildChart(reportData), [reportData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        removeToken();
        navigate('/login');
    }

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { key: 'submit', label: 'Submit Grievance', icon: <SubmitIcon /> },
        { key: 'grievances', label: 'My Grievances', icon: <GrievancesIcon /> },
        { key: 'track', label: 'Track Status', icon: <TrackIcon /> },
        { key: 'notifications', label: 'Notifications', icon: <NotifIcon />, badge: unreadCount },
        { key: 'profile', label: 'Profile', icon: <ProfileIcon /> },
        { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
        { key: 'help', label: 'Need Help', icon: <HelpIcon /> },
    ];

    return (
        <div className="dashboard" id="dashboard-page">
            {/* ── Sidebar ─────────────────────────────── */}
            <aside className="sidebar" id="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <DashboardIcon />
                    </div>
                    <span className="logo-text">GrievSetu</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                            onClick={() => setActiveNav(item.key)}
                            id={`nav-${item.key}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-support" onClick={() => setActiveNav('help')} style={{cursor:'pointer'}}>
                    <div className="support-title">Need Help?</div>
                    <div className="support-text">Contact Support</div>
                    <a className="support-link">
                        <ExternalLinkIcon />
                    </a>
                </div>
            </aside>

            {/* ── Main Content ────────────────────────── */}
            <main className="main-content">
                {/* Top Header */}
                <header className="top-header" id="top-header">
                    <div className="welcome-section">
                        <h1>Welcome, {username} 👋</h1>
                        <p>Manage & track your grievances efficiently.</p>
                    </div>
                    <div className="header-actions">
                        <button className="header-icon-btn" aria-label="Notifications" id="header-notif-btn" onClick={() => setActiveNav('notifications')}>
                            <NotifIcon />
                            {unreadCount > 0 && <span className="notification-dot" />}
                        </button>
                        <button className="header-icon-btn" aria-label="Messages" id="header-msg-btn">
                            <MessageIcon />
                        </button>
                        <div className="user-profile-wrapper" ref={dropdownRef}>
                            <button
                                className="user-profile"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                id="user-profile-btn"
                            >
                                {avatarUrl ? <img src={avatarUrl} alt="" className="user-avatar-img" /> : <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>}
                                <span className="user-name">{username}</span>
                                <ChevronDown />
                            </button>

                            {dropdownOpen && (
                                <div className="profile-dropdown" id="profile-dropdown">
                                    <div className="dropdown-user-info">
                                        {avatarUrl ? <img src={avatarUrl} alt="" className="dropdown-avatar-img" /> : <div className="dropdown-avatar">{username.charAt(0).toUpperCase()}</div>}
                                        <div>
                                            <div className="dropdown-username">{username}</div>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item" id="dropdown-profile" onClick={() => { setActiveNav('profile'); setDropdownOpen(false); }}>
                                        <ViewProfileIcon /> View Profile
                                    </button>
                                    <button className="dropdown-item" id="dropdown-settings" onClick={() => { setActiveNav('settings'); setDropdownOpen(false); }}>
                                        <UserSettingIcon /> User Setting
                                    </button>
                                    <button className="dropdown-item" id="dropdown-notifications" onClick={() => { setActiveNav('notifications'); setDropdownOpen(false); }}>
                                        <NotifDropdownIcon /> Notification
                                    </button>

                                    <button className="dropdown-item" id="dropdown-help" onClick={() => { setActiveNav('help'); setDropdownOpen(false); }}>
                                        <HelpDropdownIcon /> Help Center
                                    </button>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item dropdown-logout" id="dropdown-logout" onClick={handleLogout}>
                                        <LogoutIcon /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                {activeNav === 'submit' ? (
                    <SubmitGrievancePage />
                ) : activeNav === 'grievances' ? (
                    <MyGrievancesPage onNavigateSubmit={() => setActiveNav('submit')} />
                ) : activeNav === 'track' ? (
                    <TrackGrievancesPage />
                ) : activeNav === 'profile' ? (
                    <ProfilePage onUpdateUsername={setUsername} onUpdateAvatar={setAvatarUrl} />
                ) : activeNav === 'settings' ? (
                    <SettingsPage />
                ) : activeNav === 'notifications' ? (
                    <NotificationsPage />
                ) : activeNav === 'help' ? (
                    <HelpPage />
                ) : (
                <div className="dashboard-content">
                    {/* Stats Row */}
                    <div className="stats-row" id="stats-row">
                        <div className="stat-card" id="stat-total">
                            <div className="stat-card-header">
                                <div className="stat-icon total"><TotalIcon /></div>
                                <span className="stat-label">Total Grievances</span>
                            </div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-sub">{stats.total === 0 ? 'No grievances yet' : `${stats.total} total filed`}</div>
                            <div className="stat-bar"><div className="stat-bar-fill total" style={{ width: stats.total > 0 ? '100%' : '0%' }} /></div>
                        </div>

                        <div className="stat-card" id="stat-pending">
                            <div className="stat-card-header">
                                <div className="stat-icon pending"><PendingIcon /></div>
                                <span className="stat-label">Pending</span>
                            </div>
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-bar"><div className="stat-bar-fill pending" style={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : '0%' }} /></div>
                        </div>

                        <div className="stat-card" id="stat-progress">
                            <div className="stat-card-header">
                                <div className="stat-icon progress"><ProgressIcon /></div>
                                <span className="stat-label">In Progress</span>
                            </div>
                            <div className="stat-value">{stats.in_progress}</div>
                            <div className="stat-bar"><div className="stat-bar-fill progress" style={{ width: stats.total > 0 ? `${(stats.in_progress / stats.total) * 100}%` : '0%' }} /></div>
                        </div>

                        <div className="stat-card" id="stat-resolved">
                            <div className="stat-card-header">
                                <div className="stat-icon resolved"><ResolvedIcon /></div>
                                <span className="stat-label">Resolved</span>
                            </div>
                            <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.resolved}</div>
                            <div className="stat-bar"><div className="stat-bar-fill resolved" style={{ width: stats.total > 0 ? `${(stats.resolved / stats.total) * 100}%` : '0%' }} /></div>
                        </div>
                    </div>

                    {/* Middle Row — Recent + Chart (swapped) */}
                    <div className="middle-row">
                        {/* Recent Grievances (now on the LEFT) */}
                        <div className="recent-card" id="recent-grievances">
                            <div className="recent-header">
                                <h3 className="recent-title">Recent Grievances</h3>
                                <a className="recent-view-all">View All</a>
                            </div>
                            <div className="recent-list">
                                {recentGrievances.length === 0 ? (
                                    <div className="empty-state">
                                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 1rem', fontSize: '0.95rem' }}>
                                            No grievances filed yet.<br />Use "Submit New Grievance" to get started.
                                        </p>
                                    </div>
                                ) : (
                                    recentGrievances.map(g => (
                                        <div className="recent-item" key={g.id}>
                                            <div className="recent-item-left">
                                                <span className="recent-id">#{g.id}</span>
                                                <span className="recent-desc">{g.text}</span>
                                            </div>
                                            <span className={`status-badge ${g.status}`}>
                                                <span className="status-dot" />
                                                {statusLabels[g.status] || g.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chart (now on the RIGHT) */}
                        <div className="chart-card" id="chart-card">
                            <div className="chart-header">
                                <h3 className="chart-title">Grievance Overview</h3>
                                <button className="chart-filter">
                                    Last 30 Days <ChevronDown />
                                </button>
                            </div>
                            <div className="chart-area">
                                <svg viewBox="0 0 580 220" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid lines */}
                                    {[50, 100, 150, 200].map((y, i) => (
                                        <line key={i} x1="40" y1={y} x2="540" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                    ))}
                                    {/* Y labels */}
                                    {chart.yLabels.map((label, i) => (
                                        <text key={i} x="25" y={50 + i * 50 + 4} fill="#94a3b8" fontSize="11" textAnchor="end">{label}</text>
                                    ))}
                                    {/* X labels */}
                                    {chart.xLabels.map((label, i) => {
                                        const spacing = chart.xLabels.length > 1
                                            ? (500 / (chart.xLabels.length - 1))
                                            : 0;
                                        const x = chart.xLabels.length === 1 ? 290 : 40 + i * spacing;
                                        return (
                                            <text key={i} x={x} y="215" fill="#94a3b8" fontSize="11" textAnchor="middle">{label}</text>
                                        );
                                    })}
                                    {/* Area fill */}
                                    <path d={chart.areaPath} fill="url(#chartGrad)" opacity="0.15" />
                                    {/* Line */}
                                    <path d={chart.linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                                    {/* Points */}
                                    {chart.points.map((p, i) => (
                                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                                    ))}
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-section" id="quick-actions">
                        <h3 className="quick-actions-title">Quick Actions</h3>
                        <div className="quick-actions-row">
                            <button className="submit-grievance-card" id="submit-grievance-btn" onClick={() => setActiveNav('submit')}>
                                <div className="plus-icon">+</div>
                                <span>Submit New<br />Grievance</span>
                            </button>
                            <div className="action-card" id="action-track" onClick={() => setActiveNav('track')}>
                                <div className="action-icon track"><TrackIcon /></div>
                                <span>Track Status</span>
                            </div>

                        </div>
                    </div>
                </div>
                )}
            </main>
        </div>
    );
}
