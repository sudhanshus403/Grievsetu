import { useState, useEffect, useCallback } from 'react';
import '../styles/notifications.css';
import { getUserId, api } from '../services/authService';

/* --- SVG Icons --- */
const CheckCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const MegaphoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotificationsPage() {
    const userId = getUserId();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(() => {
        if (!userId) return;
        api.get(`/notifications/${userId}`)
            .then(res => {
                setNotifications(res.data);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [userId]);

    // Fetch on mount and poll every 10 seconds for real-time feel
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAllAsRead = () => {
        api.put(`/notifications/mark_all_read/${userId}`)
            .then(() => {
                setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            });
    };

    const markAsRead = (id) => {
        api.put(`/notifications/mark_read/${id}`)
            .then(() => {
                setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            });
    };

    const deleteNotification = (id) => {
        api.delete(`/notifications/${id}`)
            .then(() => {
                setNotifications(notifications.filter(n => n.id !== id));
            });
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'success': return <CheckCircleIcon />;
            case 'warning': return <AlertTriangleIcon />;
            case 'info': return <InfoIcon />;
            case 'security': return <ShieldIcon />;
            case 'admin': return <MegaphoneIcon />;
            default: return <InfoIcon />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        return true;
    });

    // Group into recent (< 24h) and earlier
    const now = new Date();
    const recentNotifs = filteredNotifications.filter(n => {
        const d = new Date(n.created_at);
        return (now - d) < 86400000;
    });
    const earlierNotifs = filteredNotifications.filter(n => {
        const d = new Date(n.created_at);
        return (now - d) >= 86400000;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) {
        return (
            <div className="notifications-page-wrapper fade-in">
                <div className="notif-header-container">
                    <div className="notif-header-titles">
                        <h2>Notifications</h2>
                        <p>Loading your notifications...</p>
                    </div>
                </div>
                <div className="notif-loading">
                    <div className="notif-loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page-wrapper fade-in">
            <div className="notif-header-container">
                <div className="notif-header-titles">
                    <h2>Notifications</h2>
                    <p>Stay updated on your grievances and account activity.</p>
                </div>
                <div className="notif-header-actions">
                    <button 
                        className="btn-mark-read" 
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <CheckIcon /> Mark all as read
                    </button>
                </div>
            </div>

            <div className="notif-tabs">
                <button 
                    className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Notifications
                    {unreadCount > 0 && filter === 'all' && <span className="badge">{unreadCount}</span>}
                </button>
                <button 
                    className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Unread
                    {unreadCount > 0 && filter === 'unread' && <span className="badge">{unreadCount}</span>}
                </button>
            </div>

            <div className="notif-list-container">
                {filteredNotifications.length === 0 ? (
                    <div className="notif-empty-state slide-up">
                        <div className="empty-icon"><InfoIcon /></div>
                        <h3>No notifications found</h3>
                        <p>You're all caught up! Check back later for updates.</p>
                    </div>
                ) : (
                    <>
                        {recentNotifs.length > 0 && (
                            <div className="notif-section slide-up" style={{ animationDelay: '0.1s' }}>
                                <h4 className="section-title">Recent</h4>
                                <div className="notif-group">
                                    {recentNotifs.map((notif) => (
                                        <NotificationCard 
                                            key={notif.id} 
                                            notif={notif} 
                                            getIconForType={getIconForType} 
                                            markAsRead={markAsRead}
                                            deleteNotification={deleteNotification}
                                            timeAgo={timeAgo}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {earlierNotifs.length > 0 && (
                            <div className="notif-section slide-up" style={{ animationDelay: '0.2s' }}>
                                <h4 className="section-title">Earlier</h4>
                                <div className="notif-group">
                                    {earlierNotifs.map((notif) => (
                                        <NotificationCard 
                                            key={notif.id} 
                                            notif={notif} 
                                            getIconForType={getIconForType} 
                                            markAsRead={markAsRead}
                                            deleteNotification={deleteNotification}
                                            timeAgo={timeAgo}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function NotificationCard({ notif, getIconForType, markAsRead, deleteNotification, timeAgo }) {
    return (
        <div className={`notif-card ${!notif.is_read ? 'unread' : ''}`}>
            {!notif.is_read && <div className="unread-indicator"></div>}
            
            <div className={`notif-icon-wrapper ${notif.type}`}>
                {getIconForType(notif.type)}
            </div>
            
            <div className="notif-content">
                <div className="notif-content-header">
                    <h5>{notif.title}</h5>
                    <span className="notif-time">{timeAgo(notif.created_at)}</span>
                </div>
                <p className="notif-desc">{notif.description}</p>
                
                <div className="notif-actions">
                    {!notif.is_read && (
                        <button className="action-btn text-primary" onClick={() => markAsRead(notif.id)}>
                            Mark as read
                        </button>
                    )}
                    <button className="action-btn text-danger" onClick={() => deleteNotification(notif.id)}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
