import ForgotPasswordCard from '../components/ForgotPasswordCard';
import '../styles/forgotpassword.css';

export default function ForgotPasswordPage() {
    return (
        <div className="forgot-page" id="forgot-password-page">
            {/* Decorative red/pink gradient blobs */}
            <div className="forgot-blob forgot-blob-1" aria-hidden="true" />
            <div className="forgot-blob forgot-blob-2" aria-hidden="true" />
            <div className="forgot-blob forgot-blob-3" aria-hidden="true" />

            {/* Center — Forgot Password Card */}
            <ForgotPasswordCard />
        </div>
    );
}
