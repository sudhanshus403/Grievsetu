import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/settings.css';
import { getUserId, removeToken, api } from '../services/authService';

// ── i18n translations ──────────────────────────────────────────
const translations = {
    en: {
        title: 'System Settings',
        subtitle: 'Configure platform language and data export',
        regional: 'Regional & Localization',
        langLabel: 'Platform Language',
        langDesc: 'Choose your preferred language for the interface.',
        dataTitle: 'Data Export',
        exportLabel: 'Export My Grievances',
        exportDesc: 'Download all your submitted grievances as an Excel file with title, description, image, date/time, and status.',
        exportBtn: 'Download Excel',
        exporting: 'Exporting...',
        dangerTitle: 'Danger Zone',
        deleteLabel: 'Delete Account',
        deleteDesc: 'Permanently delete your account and all associated data. You will have 24 hours to log back in and cancel.',
        deleteBtn: 'Delete Account',
        cancelDeleteBtn: 'Cancel Deletion',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        version: 'GrievSetu Portal Version 1.2.4',
    },
    hi: {
        title: 'सिस्टम सेटिंग्स',
        subtitle: 'प्लेटफ़ॉर्म भाषा और डेटा निर्यात कॉन्फ़िगर करें',
        regional: 'क्षेत्रीय और स्थानीयकरण',
        langLabel: 'प्लेटफ़ॉर्म भाषा',
        langDesc: 'इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।',
        dataTitle: 'डेटा निर्यात',
        exportLabel: 'मेरी शिकायतें निर्यात करें',
        exportDesc: 'शीर्षक, विवरण, छवि, दिनांक/समय और स्थिति के साथ अपनी सभी शिकायतें Excel फ़ाइल के रूप में डाउनलोड करें।',
        exportBtn: 'Excel डाउनलोड करें',
        exporting: 'निर्यात हो रहा है...',
        dangerTitle: 'खतरे का क्षेत्र',
        deleteLabel: 'खाता हटाएं',
        deleteDesc: 'अपना खाता और सभी संबंधित डेटा स्थायी रूप से हटाएं। आपके पास रद्द करने के लिए 24 घंटे होंगे।',
        deleteBtn: 'खाता हटाएं',
        cancelDeleteBtn: 'हटाना रद्द करें',
        terms: 'सेवा की शर्तें',
        privacy: 'गोपनीयता नीति',
        version: 'ग्रीवसेतु पोर्टल संस्करण 1.2.4',
    }
};

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const FileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const ExcelIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
);

const WarningIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

export default function SettingsPage() {
    const navigate = useNavigate();
    const userId = getUserId();
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [exporting, setExporting] = useState(false);

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteScheduled, setDeleteScheduled] = useState(null); // ISO string
    const [countdown, setCountdown] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const t = translations[language] || translations.en;

    // Apply language change in real time to the whole document
    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
    }, [language]);

    // Check if account has a pending deletion
    useEffect(() => {
        if (!userId) return;
        api.get(`/delete_status/${userId}`)
            .then(res => {
                if (res.data.delete_scheduled) {
                    setDeleteScheduled(res.data.delete_scheduled_at);
                }
            })
            .catch(() => {});
    }, [userId]);

    // Countdown timer for pending deletion
    useEffect(() => {
        if (!deleteScheduled) { setCountdown(''); return; }
        const tick = () => {
            const now = new Date();
            const target = new Date(deleteScheduled);
            const diff = target - now;
            if (diff <= 0) {
                setCountdown('Expired');
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            setCountdown(`${hours}h ${mins}m ${secs}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [deleteScheduled]);

    const handleExport = async () => {
        if (!userId) return;
        setExporting(true);
        try {
            const response = await api.get(`/export/${userId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'GrievSetu_Grievances.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed', err);
            alert('Export failed. Please try again.');
        }
        setExporting(false);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setDeleteError('Please enter your password to confirm.');
            return;
        }
        setDeleteLoading(true);
        setDeleteError('');
        try {
            const res = await api.post(`/request_delete/${userId}`, { password: deletePassword });
            setDeleteScheduled(res.data.delete_scheduled_at);
            setShowDeleteModal(false);
            setDeletePassword('');
            // Log user out after scheduling deletion
            setTimeout(() => {
                removeToken();
                navigate('/login');
            }, 2000);
        } catch (err) {
            const detail = err.response?.data?.detail || err.message || 'Failed to schedule deletion';
            setDeleteError(detail);
        }
        setDeleteLoading(false);
    };

    const handleCancelDeletion = async () => {
        setCancelLoading(true);
        try {
            await api.post(`/cancel_delete/${userId}`);
            setDeleteScheduled(null);
            setCountdown('');
        } catch (err) {
            console.error('Cancel deletion failed', err);
        }
        setCancelLoading(false);
    };

    return (
        <div className="settings-page-wrapper fade-in">
            <div className="settings-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            <div className="settings-grid">
                {/* Regional Settings — Language Only */}
                <section className="settings-card slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="card-header">
                        <div className="icon-wrapper"><GlobeIcon /></div>
                        <h3>{t.regional}</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-row">
                            <div className="setting-info">
                                <label>{t.langLabel}</label>
                                <span>{t.langDesc}</span>
                            </div>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Data Export — Excel Only */}
                <section className="settings-card slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="card-header">
                        <div className="icon-wrapper export-icon"><ExcelIcon /></div>
                        <h3>{t.dataTitle}</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-row">
                            <div className="setting-info">
                                <label>{t.exportLabel}</label>
                                <span>{t.exportDesc}</span>
                            </div>
                            <button className="btn-action btn-excel" onClick={handleExport} disabled={exporting}>
                                <DownloadIcon /> {exporting ? t.exporting : t.exportBtn}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="settings-card danger slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="card-header">
                        <div className="icon-wrapper danger-icon"><TrashIcon /></div>
                        <h3 className="text-danger">{t.dangerTitle}</h3>
                    </div>
                    <div className="card-body">
                        <div className="setting-row">
                            <div className="setting-info">
                                <label className="text-danger">{t.deleteLabel}</label>
                                <span>{t.deleteDesc}</span>
                            </div>
                            {deleteScheduled ? (
                                <div className="delete-pending-actions">
                                    <div className="delete-countdown-badge">
                                        <WarningIcon />
                                        <span>Deleting in {countdown}</span>
                                    </div>
                                    <button className="btn-action btn-cancel-delete" onClick={handleCancelDeletion} disabled={cancelLoading}>
                                        {cancelLoading ? 'Cancelling...' : t.cancelDeleteBtn}
                                    </button>
                                </div>
                            ) : (
                                <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                                    {t.deleteBtn}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Legal Footer */}
                <div className="settings-footer slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="legal-links">
                        <button className="legal-link"><FileIcon /> {t.terms}</button>
                        <button className="legal-link"><FileIcon /> {t.privacy}</button>
                    </div>
                    <p className="app-version">{t.version}</p>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => { setShowDeleteModal(false); setDeleteError(''); setDeletePassword(''); }}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon danger">
                            <TrashIcon />
                        </div>
                        <h3>Delete Your Account?</h3>
                        <p className="modal-desc">
                            This will permanently delete your account and all associated data (grievances, notifications, profile) after <strong>24 hours</strong>. 
                            You can cancel the deletion by logging back in within this period.
                        </p>
                        <div className="modal-warning-banner">
                            <WarningIcon />
                            <span>Your data will be shared with the Admin before deletion.</span>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem', width: '100%' }}>
                            <label style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Enter your password to confirm</label>
                            <input 
                                type="password" 
                                value={deletePassword} 
                                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }} 
                                placeholder="Enter your password"
                                className="modal-input"
                                autoFocus
                            />
                        </div>
                        {deleteError && <div className="modal-error">{deleteError}</div>}
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => { setShowDeleteModal(false); setDeleteError(''); setDeletePassword(''); }}>Cancel</button>
                            <button className="btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                                {deleteLoading ? 'Scheduling...' : 'Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
