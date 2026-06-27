import SignupCard from '../components/SignupCard';
import '../styles/signup.css';

export default function SignupPage() {
    return (
        <div className="signup-page" id="signup-page">
            {/* Decorative gradient blobs */}
            <div className="signup-blob signup-blob-1" aria-hidden="true" />
            <div className="signup-blob signup-blob-2" aria-hidden="true" />
            <div className="signup-blob signup-blob-3" aria-hidden="true" />
            <div className="signup-blob signup-blob-4" aria-hidden="true" />

            {/* Top — Title Text */}
            <section className="signup-top" aria-label="Welcome section">
                <h1 className="carpet-title">Signup with the GrievSetu!</h1>
            </section>

            {/* Center — Signup Card */}
            <section className="signup-center" aria-label="Signup form">
                <SignupCard />
            </section>
        </div>
    );
}
