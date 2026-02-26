import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithProvider } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/profile');
        } catch (err) {
            setError(err.message || 'Failed to log in');
        }
        setLoading(false);
    };

    const handleProviderLogin = async (provider) => {
        try {
            await loginWithProvider(provider);
            navigate('/profile');
        } catch (err) {
            setError('Failed to log in with ' + provider);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-box">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Login to track your orders and more.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <div className="auth-providers">
                    <button className="provider-btn google" onClick={() => handleProviderLogin('google')}>
                        <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" />
                        Continue with Google
                    </button>
                    <button className="provider-btn facebook" onClick={() => handleProviderLogin('facebook')}>
                        <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" />
                        Continue with Facebook
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
