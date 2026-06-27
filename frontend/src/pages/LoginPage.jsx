import LoginCard from '../components/LoginCard';
import '../styles/login.css';

export default function LoginPage() {
    return (
        <div className="login-page" id="login-page">
            {/* Decorative gradient blobs */}
            <div className="blob blob-1" aria-hidden="true" />
            <div className="blob blob-2" aria-hidden="true" />
            <div className="blob blob-3" aria-hidden="true" />

            {/* Left — Welcome Text */}
            <section className="login-left" aria-label="Welcome section">
                <h1 className="welcome-text">Welcome&nbsp;To&nbsp;GrievSetu&nbsp;!!</h1>
            </section>

            {/* Right — Login Card */}
            <section className="login-right" aria-label="Login form">
                <LoginCard />
            </section>
        </div>
    );
}
