import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USER_API = API;

/* ── Icons ────────────────────────────────────────────────────── */
const DashIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
const ListIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
const ShieldIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const BellIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const LogoutIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const UserPlusIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>);
const ArrowUpIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>);
const DownloadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);

const statusLabels = { pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved', escalated: 'Escalated', needs_review: 'Needs Review' };
const dateFilters = [
    { key: null, label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: '1 Week' },
    { key: 'month', label: '1 Month' },
    { key: 'custom', label: 'Custom' }
];

const parseGrievanceText = (text) => {
    if (!text) return { title: 'No title', description: 'No description' };
    let cleanedText = text.replace(/^\[.*?\]\s*/, '');
    const dotIndex = cleanedText.indexOf('.');
    if (dotIndex !== -1) {
        return {
            title: cleanedText.substring(0, dotIndex).trim(),
            description: cleanedText.substring(dotIndex + 1).trim() || 'No description provided'
        };
    } else {
        return {
            title: cleanedText.trim(),
            description: 'No description provided'
        };
    }
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('admin_name') || 'Admin';
    const [activeNav, setActiveNav] = useState('grievances');

    // Stats
    const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, escalated: 0, today: 0 });

    // Grievances
    const [grievances, setGrievances] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [dateFilter, setDateFilter] = useState(null);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    // Modals
    const [notifModal, setNotifModal] = useState(null);
    const [notifForm, setNotifForm] = useState({ title: '', description: '' });
    const [assignModal, setAssignModal] = useState(false);
    const [assignEmail, setAssignEmail] = useState('');
    const [actionMsg, setActionMsg] = useState('');
    
    // Export state
    const [exporting, setExporting] = useState(false);
    const [exportDateFilter, setExportDateFilter] = useState('');
    const [exportStart, setExportStart] = useState('');
    const [exportEnd, setExportEnd] = useState('');

    const fetchStats = useCallback(() => {
        axios.get(`${API}/admin/stats`).then(r => setStats(r.data)).catch(() => {});
    }, []);

    const fetchGrievances = useCallback(() => {
        let params = `?page=${page}&per_page=${perPage}`;
        if (dateFilter && dateFilter !== 'custom') params += `&date_filter=${dateFilter}`;
        if (dateFilter === 'custom' && customStart && customEnd) params += `&date_filter=custom&custom_start=${customStart}&custom_end=${customEnd}`;
        axios.get(`${API}/admin/grievances${params}`)
            .then(r => { setGrievances(r.data.grievances); setTotal(r.data.total); setTotalPages(r.data.total_pages); })
            .catch(() => {});
    }, [page, perPage, dateFilter, customStart, customEnd]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${API}/admin/update_status/${id}`, { status });
            setActionMsg(`Grievance #${id} → ${statusLabels[status] || status}`);
            fetchGrievances(); fetchStats();
            setTimeout(() => setActionMsg(''), 3000);
        } catch (e) { console.error(e); }
    };

    const handleEscalate = async (id) => {
        try {
            await axios.put(`${API}/admin/escalate/${id}`, { reason: 'High confidence score - escalated by admin' });
            setActionMsg(`Grievance #${id} escalated to higher authority!`);
            fetchGrievances(); fetchStats();
            setTimeout(() => setActionMsg(''), 3000);
        } catch (e) { console.error(e); }
    };

    const handleSendNotif = async () => {
        if (!notifForm.title || !notifForm.description) return;
        try {
            await axios.post(`${API}/admin/send_notification`, {
                user_id: notifModal,
                title: notifForm.title,
                description: notifForm.description,
                type: 'admin'
            });
            setActionMsg('Notification sent to user!');
            setNotifModal(null);
            setNotifForm({ title: '', description: '' });
            setTimeout(() => setActionMsg(''), 3000);
        } catch (e) { console.error(e); }
    };

    const handleAssignAdmin = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.post(`${API}/admin/assign`, { email: assignEmail }, { headers: { Authorization: `Bearer ${token}` } });
            setActionMsg(`${assignEmail} is now an admin!`);
            setAssignModal(false);
            setAssignEmail('');
            setTimeout(() => setActionMsg(''), 3000);
        } catch (e) {
            setActionMsg(e.response?.data?.detail || 'Failed to assign admin');
            setTimeout(() => setActionMsg(''), 3000);
        }
    };

    const handleExportData = async () => {
        setExporting(true);
        try {
            let params = '';
            if (exportDateFilter && exportDateFilter !== 'custom') params = `?date_filter=${exportDateFilter}`;
            if (exportDateFilter === 'custom' && exportStart && exportEnd) params = `?date_filter=custom&custom_start=${exportStart}&custom_end=${exportEnd}`;
            
            const response = await axios.get(`${API}/admin/export_grievances${params}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Grievances_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setActionMsg('Data exported successfully!');
            setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
            setActionMsg('Export failed. Please try again.');
            setTimeout(() => setActionMsg(''), 3000);
        }
        setExporting(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        localStorage.removeItem('admin_id');
        navigate('/login');
    };

    const getConfLevel = (score) => {
        if (score === null || score === undefined) return { cls: 'unknown', pct: null };
        if (score >= 0.85) return { cls: 'high', pct: score * 100 };
        if (score >= 0.6) return { cls: 'medium', pct: score * 100 };
        return { cls: 'low', pct: score * 100 };
    };

    return (
        <div className="admin-layout fade-in">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <div className="logo-dot"><ShieldIcon /></div>
                    <span>GrievSetu</span>
                </div>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeNav === 'grievances' ? 'active' : ''}`} onClick={() => setActiveNav('grievances')}>
                        <ListIcon /> <span>Grievances</span>
                        {stats.pending > 0 && <span className="nav-badge">{stats.pending}</span>}
                    </button>
                    <button className={`admin-nav-item ${activeNav === 'overview' ? 'active' : ''}`} onClick={() => setActiveNav('overview')}>
                        <DashIcon /> <span>Overview</span>
                    </button>
                    <button className={`admin-nav-item ${activeNav === 'export' ? 'active' : ''}`} onClick={() => setActiveNav('export')}>
                        <DownloadIcon /> <span>Export Data</span>
                    </button>
                    <button className="admin-nav-item" onClick={() => setAssignModal(true)}>
                        <UserPlusIcon /> <span>Assign Admin</span>
                    </button>
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogoutIcon /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <h1>{activeNav === 'grievances' ? 'Grievance Management' : activeNav === 'export' ? 'Export Data' : 'Dashboard Overview'}</h1>
                    <div className="admin-topbar-right">
                        {actionMsg && <div className="admin-topbar-badge">{actionMsg}</div>}
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Welcome, <strong style={{ color: '#f1f5f9' }}>{adminName}</strong></span>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Stats */}
                    <div className="admin-stats-row slide-up" style={{ animationDelay: '0.1s' }}>
                        {[
                            { label: 'Total', value: stats.total, cls: 'total' },
                            { label: 'Pending', value: stats.pending, cls: 'pending' },
                            { label: 'In Progress', value: stats.in_progress, cls: 'progress' },
                            { label: 'Resolved', value: stats.resolved, cls: 'resolved' },
                            { label: 'Escalated', value: stats.escalated, cls: 'escalated' },
                            { label: 'Today', value: stats.today, cls: 'today' },
                        ].map(s => (
                            <div className="admin-stat-card" key={s.label}>
                                <div className="admin-stat-header">
                                    <div className={`admin-stat-icon ${s.cls}`}><DashIcon /></div>
                                </div>
                                <div className="admin-stat-value">{s.value}</div>
                                <div className="admin-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {activeNav === 'grievances' && (
                        <>
                            {/* Filters */}
                            <div className="admin-filters-bar slide-up" style={{ animationDelay: '0.2s' }}>
                                {dateFilters.map(f => (
                                    <button key={f.label} className={`admin-filter-btn ${dateFilter === f.key ? 'active' : ''}`}
                                        onClick={() => { setDateFilter(f.key); setPage(1); }}>
                                        {f.label}
                                    </button>
                                ))}
                                {dateFilter === 'custom' && (
                                    <>
                                        <input type="date" className="admin-filter-input" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                                        <span style={{ color: '#94a3b8' }}>to</span>
                                        <input type="date" className="admin-filter-input" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                                    </>
                                )}
                                <select className="admin-filter-select" value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                                    <option value={10}>10 / page</option>
                                    <option value={50}>50 / page</option>
                                    <option value={100}>100 / page</option>
                                </select>
                            </div>

                            {/* Table */}
                            <div className="admin-table-card slide-up" style={{ animationDelay: '0.3s' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Department</th>
                                            <th>Image</th>
                                            <th>Status</th>
                                            <th>Confidence</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grievances.length === 0 ? (
                                            <tr><td colSpan={10} className="admin-empty">No grievances found</td></tr>
                                        ) : grievances.map(g => {
                                            const conf = getConfLevel(g.confidence_score);
                                            const parsed = parseGrievanceText(g.text);
                                            return (
                                                <tr key={g.id}>
                                                    <td><strong>#{g.id}</strong></td>
                                                    <td><div className="grievance-text"><strong>{parsed.title}</strong></div></td>
                                                    <td><div className="grievance-desc" style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parsed.description}</div></td>
                                                    <td>{g.category}</td>
                                                    <td><span className="department-tag">{g.department || 'Unassigned'}</span></td>
                                                    <td>
                                                        {g.image_path ? (
                                                            <img src={`${USER_API}/${g.image_path}`} alt="" className="grievance-img" />
                                                        ) : (
                                                            <div className="no-img">N/A</div>
                                                        )}
                                                    </td>
                                                    <td><span className={`status-pill ${g.status}`}>{statusLabels[g.status] || g.status}</span></td>
                                                    <td>
                                                        {conf.pct !== null ? (
                                                            <div className="confidence-bar">
                                                                <div className="confidence-fill">
                                                                    <div className={`confidence-fill-inner ${conf.cls}`} style={{ width: `${conf.pct}%` }} />
                                                                </div>
                                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{Math.round(conf.pct)}%</span>
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>N/A</span>
                                                        )}
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                        {g.created_at ? new Date(g.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                                                    </td>
                                                    <td>
                                                        <select className="admin-filter-select" style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                                            value={g.status} onChange={e => handleStatusChange(g.id, e.target.value)}>
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="resolved">Resolved</option>
                                                        </select>
                                                        {conf.pct !== null && conf.pct >= 80 && g.status !== 'escalated' && (
                                                            <button className="admin-action-btn escalate" title="Escalate" onClick={() => handleEscalate(g.id)}>
                                                                <ArrowUpIcon /> ↑
                                                            </button>
                                                        )}
                                                        <button className="admin-action-btn" title="Notify User" onClick={() => setNotifModal(g.user_id)}>
                                                            <BellIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="admin-pagination">
                                    <div className="admin-pagination-info">
                                        Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} of {total}
                                    </div>
                                    <div className="admin-pagination-btns">
                                        <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                            <button key={p} className={`admin-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                                        ))}
                                        <button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeNav === 'export' && (
                        <div className="admin-table-card slide-up" style={{ padding: '2rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Download Grievance Data</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Export the platform's grievance data as an Excel spreadsheet to send to resolving organizations.</p>
                            </div>
                            
                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f1f5f9' }}>Date Range Filter</label>
                                <select 
                                    className="admin-filter-select" 
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                    value={exportDateFilter} 
                                    onChange={e => setExportDateFilter(e.target.value)}
                                >
                                    <option value="">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="week">Past 7 Days</option>
                                    <option value="month">Past 30 Days</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                                
                                {exportDateFilter === 'custom' && (
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Start Date</label>
                                            <input type="date" className="admin-filter-input" style={{ width: '100%' }} value={exportStart} onChange={e => setExportStart(e.target.value)} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>End Date</label>
                                            <input type="date" className="admin-filter-input" style={{ width: '100%' }} value={exportEnd} onChange={e => setExportEnd(e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={handleExportData} 
                                disabled={exporting || (exportDateFilter === 'custom' && (!exportStart || !exportEnd))}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.8rem 1.5rem', borderRadius: '10px',
                                    backgroundColor: '#10b981', color: '#fff', border: 'none',
                                    fontWeight: '600', cursor: exporting ? 'not-allowed' : 'pointer',
                                    opacity: exporting ? 0.7 : 1, transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                                }}
                            >
                                <DownloadIcon />
                                {exporting ? 'Exporting...' : 'Download Excel Sheet'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Send Notification Modal */}
            {notifModal && (
                <div className="admin-modal-overlay" onClick={() => setNotifModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Send Notification to User</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} placeholder="Notification title" />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea rows={3} value={notifForm.description} onChange={e => setNotifForm({...notifForm, description: e.target.value})} placeholder="Enter message..." />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-modal-cancel" onClick={() => setNotifModal(null)}>Cancel</button>
                            <button className="admin-modal-submit" onClick={handleSendNotif}>Send</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Admin Modal */}
            {assignModal && (
                <div className="admin-modal-overlay" onClick={() => setAssignModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Assign New Admin</h3>
                        <div className="form-group">
                            <label>User Email</label>
                            <input value={assignEmail} onChange={e => setAssignEmail(e.target.value)} placeholder="user@email.com" />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-modal-cancel" onClick={() => setAssignModal(false)}>Cancel</button>
                            <button className="admin-modal-submit" onClick={handleAssignAdmin}>Assign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
