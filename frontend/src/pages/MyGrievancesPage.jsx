import { useState, useEffect } from 'react';
import { getUserId, api } from '../services/authService';
import '../styles/mygrievances.css';

/* ── Helper: format ID as 5-digit code ────────────────────────── */
const fmtId = (id) => String(id).padStart(5, '0');

/* ── Helper: Parse text to title and description ──────────────── */
const parseGrievanceText = (text) => {
    if (!text) return { title: 'No title', description: 'No description' };
    
    // Remove the [Category] from the beginning if it exists
    let cleanedText = text.replace(/^\[.*?\]\s*/, '');
    
    // Split by the first period
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

/* ── SVG Icons ───────────────────────────────────────────────── */
const TotalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
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
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const HashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);
const EmptyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const STATUS_MAP = {
    pending: 'Pending',
    in_progress: 'In Progress',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
};

function getCategoryClass(cat) {
    if (!cat) return 'default';
    const c = cat.toLowerCase();
    if (c.includes('road')) return 'road';
    if (c.includes('electric')) return 'electricity';
    if (c.includes('water')) return 'water';
    if (c.includes('sanit')) return 'sanitation';
    return 'default';
}

export default function MyGrievancesPage({ onNavigateSubmit }) {
    const userId = getUserId();
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        api.get(`/my_grievances/${userId}`)
            .then(res => { setGrievances(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [userId]);

    /* ── Computed stats ─────────────────────────────────────────── */
    const stats = {
        total: grievances.length,
        pending: grievances.filter(g => g.status === 'pending').length,
        in_progress: grievances.filter(g => g.status === 'in_progress' || g.status === 'in-progress').length,
        resolved: grievances.filter(g => g.status === 'resolved').length,
    };

    /* ── Filtered & searched list ────────────────────────────────── */
    const filtered = grievances.filter(g => {
        if (filter === 'pending' && g.status !== 'pending') return false;
        if (filter === 'in_progress' && g.status !== 'in_progress' && g.status !== 'in-progress') return false;
        if (filter === 'resolved' && g.status !== 'resolved') return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            return fmtId(g.id).includes(q) || (g.text || '').toLowerCase().includes(q) || (g.category || '').toLowerCase().includes(q);
        }
        return true;
    });

    const filters = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'pending', label: 'Pending', count: stats.pending },
        { key: 'in_progress', label: 'In Progress', count: stats.in_progress },
        { key: 'resolved', label: 'Resolved', count: stats.resolved },
    ];

    return (
        <div className="mg-page" id="my-grievances-page">
            {/* Header */}
            <div className="mg-page-header">
                <h2>My Grievances</h2>
                <p>Track and manage all your submitted grievances</p>
            </div>

            {/* Stats Row */}
            <div className="mg-stats-row" id="mg-stats-row">
                <div className="mg-stat-card total">
                    <div className="mg-stat-top">
                        <span className="mg-stat-label">Total Filed</span>
                        <div className="mg-stat-icon"><TotalIcon /></div>
                    </div>
                    <div className="mg-stat-value">{stats.total}</div>
                    <div className="mg-stat-sub">{stats.total === 0 ? 'No grievances yet' : `${stats.total} grievance${stats.total > 1 ? 's' : ''} registered`}</div>
                </div>
                <div className="mg-stat-card pending">
                    <div className="mg-stat-top">
                        <span className="mg-stat-label">Pending</span>
                        <div className="mg-stat-icon"><PendingIcon /></div>
                    </div>
                    <div className="mg-stat-value">{stats.pending}</div>
                    <div className="mg-stat-sub">Awaiting review</div>
                </div>
                <div className="mg-stat-card in-progress">
                    <div className="mg-stat-top">
                        <span className="mg-stat-label">In Progress</span>
                        <div className="mg-stat-icon"><ProgressIcon /></div>
                    </div>
                    <div className="mg-stat-value">{stats.in_progress}</div>
                    <div className="mg-stat-sub">Being addressed</div>
                </div>
                <div className="mg-stat-card resolved">
                    <div className="mg-stat-top">
                        <span className="mg-stat-label">Resolved</span>
                        <div className="mg-stat-icon"><ResolvedIcon /></div>
                    </div>
                    <div className="mg-stat-value">{stats.resolved}</div>
                    <div className="mg-stat-sub">Successfully closed</div>
                </div>
            </div>

            {/* Toolbar — Filters + Search */}
            <div className="mg-toolbar" id="mg-toolbar">
                <div className="mg-filter-tabs">
                    {filters.map(f => (
                        <button
                            key={f.key}
                            className={`mg-filter-tab ${filter === f.key ? 'active' : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}<span className="mg-tab-count">{f.count}</span>
                        </button>
                    ))}
                </div>
                <div className="mg-search-box">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search by ID or keyword..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        id="mg-search-input"
                    />
                </div>
            </div>

            {/* Grievance List */}
            <div className="mg-list-container" id="mg-list">
                <div className="mg-list-header">
                    <span>Grievance ID</span>
                    <span>Title</span>
                    <span>Description</span>
                    <span>Category</span>
                    <span>Status</span>
                </div>

                {loading ? (
                    <div className="mg-empty">
                        <p>Loading grievances...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mg-empty">
                        <div className="mg-empty-icon"><EmptyIcon /></div>
                        <h3>{search ? 'No matching grievances' : 'No grievances found'}</h3>
                        <p>{search ? 'Try a different search term' : 'Submit your first grievance to get started'}</p>
                        {!search && (
                            <button className="mg-empty-btn" onClick={onNavigateSubmit}>
                                + Submit Grievance
                            </button>
                        )}
                    </div>
                ) : (
                    filtered.map(g => {
                        const parsed = parseGrievanceText(g.text);
                        return (
                        <div className="mg-grievance-row" key={g.id} id={`mg-row-${g.id}`}>
                            <div className="mg-gid">
                                <HashIcon />
                                {fmtId(g.id)}
                            </div>
                            <div className="mg-title-col">
                                <span className="mg-title-text" title={parsed.title}>{parsed.title}</span>
                                <span className="mg-desc-date">
                                    {g.created_at ? new Date(g.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                </span>
                            </div>
                            <div className="mg-desc-col">
                                <span className="mg-desc-text" title={parsed.description}>{parsed.description}</span>
                            </div>
                            <div className={`mg-category-pill ${getCategoryClass(g.category)}`}>
                                <span className="mg-cat-dot" />
                                {g.category || 'General'}
                            </div>
                            <div className={`mg-status-badge ${g.status}`}>
                                <span className="mg-status-dot" />
                                {STATUS_MAP[g.status] || g.status}
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
}
