import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Calendar, ShieldCheck, ShieldAlert, X, Trash2, Ban, CheckCircle } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users.json`);
            const rawData = await response.json();
            const dataArray = rawData ? (Array.isArray(rawData) ? rawData : Object.values(rawData)).filter(Boolean) : [];
            setUsers(dataArray);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users/${userId}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchUsers();
                if (selectedUser && selectedUser.id === userId) {
                    setSelectedUser({ ...selectedUser, status: newStatus });
                }
            }
        } catch (err) {
            console.error("Error updating user status:", err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to completely delete this user? This action cannot be undone.")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/users/${userId}.json`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchUsers();
                    setSelectedUser(null);
                }
            } catch (err) {
                console.error("Error deleting user:", err);
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading Users...</div>;

    return (
        <div className="admin-page premium-users-management">
            <div className="admin-header premium-header">
                <div className="header-title">
                    <div className="icon-wrapper glass">
                        <Users size={24} color="#000" />
                    </div>
                    <div>
                        <h2>Manage Users</h2>
                        <p className="subtitle">View and manage registered store customers</p>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="premium-search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="premium-users-grid">
                {filteredUsers.map(user => (
                    <div key={user.id} className={`premium-user-card ${user.status === 'blocked' ? 'blocked-card' : ''}`}>
                        <div className="user-card-header">
                            <div className="user-avatar-premium">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    <span>{user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className={`user-status-indicator ${user.status === 'blocked' ? 'blocked' : 'active'}`}>
                                {user.status === 'blocked' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                                <span>{user.status === 'blocked' ? 'Blocked' : 'Active User'}</span>
                            </div>
                        </div>

                        <div className="user-card-body">
                            <h3 style={{ color: user.status === 'blocked' ? '#666' : '#111' }}>{user.name}</h3>
                            <div className="user-detail-row">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                            <div className="user-detail-row">
                                <Calendar size={16} />
                                <span>Joined: {new Date(user.dateJoined).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="user-card-footer">
                            <div className="user-id">ID: {user.id.slice(0, 8)}</div>
                            <button
                                className="view-profile-btn"
                                onClick={() => setSelectedUser(user)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="premium-empty-state">
                        <Users size={48} opacity={0.2} />
                        <p>No registered users found.</p>
                    </div>
                )}
            </div>

            {/* Modal for User Details */}
            {selectedUser && (
                <div className="premium-modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="premium-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedUser(null)}>
                            <X size={24} />
                        </button>

                        <div className="modal-user-header">
                            <div className="modal-avatar">
                                {selectedUser.avatar ? (
                                    <img src={selectedUser.avatar} alt={selectedUser.name} />
                                ) : (
                                    <span>{selectedUser.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="modal-user-title">
                                <h2>{selectedUser.name}</h2>
                                <span className={`modal-status-badge ${selectedUser.status === 'blocked' ? 'blocked' : 'active'}`}>
                                    {selectedUser.status === 'blocked' ? 'Blocked Account' : 'Active Account'}
                                </span>
                            </div>
                        </div>

                        <div className="modal-user-details">
                            <div className="detail-group">
                                <h3>Contact Information</h3>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>User ID:</strong> <span className="mono">{selectedUser.id}</span></p>
                                <p><strong>Registration Date:</strong> {new Date(selectedUser.dateJoined).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="modal-user-actions">
                            {selectedUser.status === 'blocked' ? (
                                <button
                                    className="action-btn unblock-btn"
                                    onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                                >
                                    <CheckCircle size={18} />
                                    Unblock User
                                </button>
                            ) : (
                                <button
                                    className="action-btn block-btn"
                                    onClick={() => handleUpdateStatus(selectedUser.id, 'blocked')}
                                >
                                    <Ban size={18} />
                                    Block User
                                </button>
                            )}

                            <button
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteUser(selectedUser.id)}
                            >
                                <Trash2 size={18} />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
