import { useState, useRef } from 'react';
import { getUserId, api } from '../services/authService';
import '../styles/submitgrievance.css';

/* ── SVG Icons for Categories ─────────────────────────────────── */
const RoadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19L8 5" /><path d="M16 5L20 19" />
        <line x1="12" y1="6" x2="12" y2="8" /><line x1="12" y1="11" x2="12" y2="13" /><line x1="12" y1="16" x2="12" y2="19" />
    </svg>
);
const ElectricityIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
const WaterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
);
const SanitationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 7 18" /><path d="M7 18a2 2 0 1 0 4 0H7z" />
        <path d="M20 6L18 18H11" /><path d="M16 6a2 2 0 1 0 4 0H16z" />
        <line x1="9" y1="2" x2="9" y2="6" /><line x1="15" y1="2" x2="15" y2="6" />
    </svg>
);
/* Smaller icons for badge/toolbar */
const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);
const SparkleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.09 6.26L20 10.27l-4.74 3.74L16.18 22 12 18.56 7.82 22l.92-7.99L4 10.27l5.91-2.01z" />
    </svg>
);
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CATEGORIES = [
    { key: 'Road', label: 'Road', icon: <RoadIcon />, iconClass: 'road', desc: 'Potholes, damaged roads, speed bumps' },
    { key: 'Electricity', label: 'Electricity', icon: <ElectricityIcon />, iconClass: 'electricity', desc: 'Power outages, faulty wiring, streetlights' },
    { key: 'Water', label: 'Water', icon: <WaterIcon />, iconClass: 'water', desc: 'Supply issues, contamination, leakage' },
    { key: 'Sanitation', label: 'Sanitation', icon: <SanitationIcon />, iconClass: 'sanitation', desc: 'Waste management, cleanliness, drains' },
];

export default function SubmitGrievancePage() {
    const userId = getUserId();
    const fileInputRef = useRef(null);


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [files, setFiles] = useState([]);         // { file, preview }
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);    // { id }
    const [dragOver, setDragOver] = useState(false);

    /* ── File handling ──────────────────────────────────────────── */
    function handleFiles(newFiles) {
        const allowed = 2 - files.length;
        if (allowed <= 0) return;
        const selected = Array.from(newFiles).slice(0, allowed).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
        }));
        setFiles(prev => [...prev, ...selected]);
    }

    function removeFile(idx) {
        setFiles(prev => {
            const next = [...prev];
            URL.revokeObjectURL(next[idx].preview);
            next.splice(idx, 1);
            return next;
        });
    }

    /* ── Submit ──────────────────────────────────────────────────── */
    async function handleSubmit() {
        if (!title.trim() || !description.trim() || !address.trim()) return;
        setLoading(true);
        try {
            let imgPath = '';
            // Upload first image if provided
            if (files.length > 0) {
                const formData = new FormData();
                formData.append('file', files[0].file);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imgPath = uploadRes.data.file_path;
            }

            const textPayload = `${title.trim()}. ${description.trim()}`;
            const res = await api.post('/submit', {
                text: textPayload,
                img_path: imgPath,
                user_id: userId,
                address: address.trim(),
            });

            setSuccess({ id: res.data.grievance_id || res.data.id || '—' });
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to submit grievance. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    /* ── Reset form ─────────────────────────────────────────────── */
    function resetForm() {
        setTitle('');
        setDescription('');
        setAddress('');
        files.forEach(f => URL.revokeObjectURL(f.preview));
        setFiles([]);
        setSuccess(null);
    }



    /* ══════════════════════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════════════════════ */
    return (
        <div className="submit-grievance-page" id="submit-grievance-page">
            {/* ── Success Overlay ──────────────────────────────── */}
            {success && (
                <div className="sg-success-overlay" id="sg-success-overlay">
                    <div className="sg-success-card">
                        <div className="sg-success-icon"><CheckIcon /></div>
                        <h3>Grievance Submitted!</h3>
                        <p>Your grievance has been registered successfully.</p>
                        <div className="sg-success-id">#{success.id}</div>
                        <p>You can track its status from the dashboard.</p>
                        <button className="sg-success-btn" onClick={resetForm} id="sg-success-close">
                            Submit Another
                        </button>
                    </div>
                </div>
            )}



            {/* ── Submission Form View ────────────────────────── */}
            {!success && (
                <div
                    className="sg-form-container"
                    style={{
                        '--card-color-1': '#3b82f6',
                        '--card-color-2': '#6366f1',
                    }}
                >
                    <div className="sg-form-header">
                        <h2>New Grievance Submission</h2>
                    </div>

                    <div className="sg-form-card" id="sg-form-card">
                        {/* Title */}
                        <div className="sg-form-group">
                            <label htmlFor="sg-title">Title</label>
                            <input
                                type="text"
                                id="sg-title"
                                placeholder={`Grievance Title (e.g., Pothole on Main Street)`}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Description with toolbar */}
                        <div className="sg-form-group">
                            <label htmlFor="sg-desc">Description</label>
                            <div className="sg-toolbar">
                                {['B', 'I', 'U', 'S'].map(t => (
                                    <button key={t} className="sg-toolbar-btn" title={t} type="button"
                                        style={t === 'B' ? { fontWeight: 800 } : t === 'I' ? { fontStyle: 'italic' } : t === 'U' ? { textDecoration: 'underline' } : { textDecoration: 'line-through' }}>
                                        {t}
                                    </button>
                                ))}
                                <span className="sg-toolbar-sep" />
                                <button className="sg-toolbar-btn" title="Link" type="button">🔗</button>
                                <button className="sg-toolbar-btn" title="List" type="button">☰</button>
                            </div>
                            <textarea
                                id="sg-desc"
                                placeholder="Detailed Description of the Issue. (Be specific — AI will analyze this)"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div className="sg-form-group">
                            <label htmlFor="sg-address">Address / Location</label>
                            <textarea
                                id="sg-address"
                                className="sg-address-input"
                                placeholder="Enter the address or location of the issue."
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                rows={2}
                            />
                        </div>

                        {/* Upload + Category Badge Row */}
                        <div className="sg-upload-row">
                            <div className="sg-upload-section">
                                <span className="sg-upload-section-label">
                                    Upload Media (Max 2 images)
                                </span>
                                <div
                                    className={`sg-upload-zone ${dragOver ? 'drag-over' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                                    id="sg-upload-zone"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                                    />
                                    <div className="sg-upload-icon"><UploadIcon /></div>
                                    <div className="sg-upload-text">
                                        <strong>{files.length >= 2 ? 'Max files reached' : 'Add Image / Drop here'}</strong>
                                        <span>PNG, JPG up to 5MB</span>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="sg-preview-grid" id="sg-preview-grid">
                                        {files.map((f, i) => (
                                            <div className="sg-preview-item" key={i}>
                                                <img src={f.preview} alt={`Upload ${i + 1}`} />
                                                <button className="sg-preview-remove" onClick={() => removeFile(i)} type="button">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* AI Notice */}
                        <div className="sg-ai-notice">
                            <SparkleIcon />
                            <span>AI will analyze text and images for sub-categories and priority assignment.</span>
                        </div>

                        {/* Actions */}
                        <div className="sg-actions" id="sg-actions">
                            <button
                                className="sg-btn-submit"
                                onClick={handleSubmit}
                                disabled={loading || !title.trim() || !description.trim() || !address.trim()}
                                id="sg-submit-btn"
                            >
                                {loading && <span className="sg-spinner" />}
                                {loading ? 'Submitting...' : 'Submit Grievance'}
                            </button>
                            <button className="sg-btn-cancel" onClick={resetForm} id="sg-cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
