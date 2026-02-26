import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!currentUser) return null;

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="user-info-large">
                    <img src={currentUser.avatar} alt={currentUser.name} />
                    <h3>{currentUser.name}</h3>
                    <p>{currentUser.email}</p>
                </div>
                <nav className="profile-nav">
                    <Link to="/profile" className="active">
                        <User size={20} />
                        Personal Info
                    </Link>
                    <Link to="/profile/orders">
                        <Package size={20} />
                        My Orders
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <h2>Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Full Name</label>
                            <p>{currentUser.name}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{currentUser.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Account Type</label>
                            <p>{currentUser.id.startsWith('u_') ? 'Standard' : currentUser.id.includes('google') ? 'Google Account' : 'Facebook Account'}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-card" onClick={() => navigate('/profile/orders')}>
                        <div className="stat-icon"><Package /></div>
                        <div className="stat-info">
                            <h3>View Orders</h3>
                            <p>Track your active and past orders</p>
                        </div>
                        <ChevronRight />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
