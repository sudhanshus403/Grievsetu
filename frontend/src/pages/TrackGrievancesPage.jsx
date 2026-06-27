import { useState, useEffect } from 'react';
import { getUserId, api } from '../services/authService';
import '../styles/trackgrievances.css';

const TrackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const fmtId = (id) => String(id).padStart(5, '0');

/* ── Helper: Parse text to title and description ──────────────── */
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
export default function TrackGrievancesPage() {
    const userId = getUserId();
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        api.get(`/my_grievances/${userId}`)
            .then(res => {
                // Filter only pending and in progress
                const active = res.data.filter(g => 
                    g.status === 'pending' || 
                    g.status === 'in_progress' || 
                    g.status === 'in-progress'
                );
                // Sort by oldest first or newest first, let's do newest first
                active.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setGrievances(active);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [userId]);

    const calculateDays = (dateStr) => {
        if (!dateStr) return 0;
        const filedDate = new Date(dateStr);
        const today = new Date();
        const diffTime = today - filedDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    return (
        <div className="tg-page">
            <div className="tg-header">
                <h2>Track Active Grievances</h2>
                <p>Monitor your pending and in-progress requests in real-time</p>
            </div>
            
            <div className="tg-container">
                {loading ? (
                    <div className="tg-loading">
                        <div className="tg-spinner"></div>
                        <p>Loading tracking data...</p>
                    </div>
                ) : grievances.length === 0 ? (
                    <div className="tg-empty">
                        <div className="tg-empty-icon"><CheckCircleIcon /></div>
                        <h3>All Clear!</h3>
                        <p>You don't have any active grievances to track right now.</p>
                    </div>
                ) : (
                    <div className="tg-grid">
                        {grievances.map((g, index) => {
                            const days = calculateDays(g.created_at);
                            const isPending = g.status === 'pending';
                            const statusText = isPending ? 'Pending' : 'In Progress';
                            
                            const parsed = parseGrievanceText(g.text);
                            
                            return (
                                <div className="tg-card" key={g.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="tg-card-inner">
                                        {/* Status Glow Banner */}
                                        <div className={`tg-glow-banner ${isPending ? 'pending' : 'progress'}`}></div>
                                        
                                        <div className="tg-card-header">
                                            <div className="tg-id-badge">#{fmtId(g.id)}</div>
                                            <div className={`tg-status-pill ${isPending ? 'pending' : 'progress'}`}>
                                                <span className="tg-status-dot"></span>
                                                {statusText}
                                            </div>
                                        </div>
                                        
                                        <div className="tg-card-body">
                                            <h4 className="tg-title">{parsed.title}</h4>
                                            <p className="tg-desc" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', marginBottom: '0.6rem' }}>{parsed.description}</p>
                                            <span className="tg-category">{g.category || 'General'}</span>
                                        </div>
                                        
                                        <div className="tg-card-footer">
                                            <div className="tg-days-container">
                                                <div className="tg-days-icon">
                                                    <ClockIcon />
                                                </div>
                                                <div className="tg-days-text">
                                                    <span className="tg-days-num">{days}</span>
                                                    <span className="tg-days-label">{days === 1 ? 'Day' : 'Days'} Active</span>
                                                </div>
                                            </div>
                                            
                                            <div className="tg-progress-container">
                                                <div className="tg-progress-text">
                                                    <span>Filed</span>
                                                    <span>{statusText}</span>
                                                </div>
                                                <div className="tg-progress-bar">
                                                    <div 
                                                        className={`tg-progress-fill ${isPending ? 'pending' : 'progress'}`} 
                                                        style={{ width: isPending ? '35%' : '85%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
