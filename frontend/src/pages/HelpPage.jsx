import { useState } from 'react';
import '../styles/help.css';
import { api } from '../services/authService';

const ChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const HelpCircle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const faqs = [
    {
        question: "How do I submit a new grievance?",
        answer: "Navigate to 'Submit Grievance' from the sidebar menu. Select a category, describe your issue with text, optionally upload an image, and click submit. You'll receive a unique grievance ID for tracking."
    },
    {
        question: "How can I track the status of my grievance?",
        answer: "Go to 'Track Status' from the sidebar. You can see all your active grievances (Pending and In Progress) along with the number of days elapsed since filing. You'll also receive notifications when the status changes."
    },
    {
        question: "Can I edit or delete a submitted grievance?",
        answer: "Once a grievance is submitted, it cannot be edited or deleted as it enters the official review pipeline. If you need to add information, you can submit a new related grievance referencing your original grievance ID."
    },
    {
        question: "How long does it take to resolve a grievance?",
        answer: "Resolution time depends on the category and priority of your grievance. Typically, high-priority issues are addressed within 3-5 business days, while regular grievances may take 7-15 business days. You can track progress in real-time."
    },
    {
        question: "How do I export my grievance data?",
        answer: "Go to Settings → Data Export section and click 'Download Excel'. This will download an Excel file containing all your grievance records with titles, descriptions, images, dates, and current status."
    }
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', issue: '' });
    const [submitMsg, setSubmitMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const toggleFaq = (idx) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.issue) {
            setSubmitMsg('Please fill in all required fields.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/support', form);
            setSubmitMsg('Your support request has been submitted! Our team will contact you shortly.');
            setForm({ name: '', email: '', phone: '', issue: '' });
        } catch (err) {
            setSubmitMsg('Failed to submit. Please try again.');
        }
        setSubmitting(false);
        setTimeout(() => setSubmitMsg(''), 5000);
    };

    return (
        <div className="help-page-wrapper fade-in">
            {/* Header */}
            <div className="help-header">
                <div className="help-header-icon">
                    <HelpCircle />
                </div>
                <h2>Need Help?</h2>
                <p>Find answers to common questions or reach out to our support team.</p>
            </div>

            <div className="help-content-grid">
                {/* FAQs Section */}
                <section className="help-section faq-section slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="section-heading">Frequently Asked Questions</h3>
                    <div className="faq-list">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                                onClick={() => toggleFaq(idx)}
                            >
                                <div className="faq-question">
                                    <span>{faq.question}</span>
                                    <div className={`faq-chevron ${openFaq === idx ? 'rotated' : ''}`}>
                                        <ChevronDown />
                                    </div>
                                </div>
                                <div className={`faq-answer ${openFaq === idx ? 'expanded' : ''}`}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Support Section */}
                <section className="help-section contact-section slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="section-heading">Contact Support</h3>
                    
                    {/* Contact Info Cards */}
                    <div className="contact-info-cards">
                        <div className="contact-info-card">
                            <div className="contact-icon phone-icon">
                                <PhoneIcon />
                            </div>
                            <div>
                                <strong>Phone Support</strong>
                                <p>+91 1800-123-4567</p>
                                <span>Mon–Sat, 9 AM – 6 PM IST</span>
                            </div>
                        </div>
                        <div className="contact-info-card">
                            <div className="contact-icon email-icon">
                                <MailIcon />
                            </div>
                            <div>
                                <strong>Email Support</strong>
                                <p>support@grievsetu.gov.in</p>
                                <span>Response within 24 hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h4>Register Your Issue</h4>
                        
                        {submitMsg && (
                            <div className={`contact-msg ${submitMsg.includes('submitted') ? 'success' : 'error'}`}>
                                {submitMsg}
                            </div>
                        )}

                        <div className="contact-form-grid">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input 
                                    type="text" 
                                    value={form.name} 
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input 
                                    type="email" 
                                    value={form.email} 
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={form.phone} 
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Describe Your Issue *</label>
                            <textarea 
                                value={form.issue} 
                                onChange={(e) => setForm({...form, issue: e.target.value})}
                                placeholder="Please describe your issue in detail..."
                                rows={5}
                            />
                        </div>

                        <button type="submit" className="btn-submit-support" disabled={submitting}>
                            <SendIcon />
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
