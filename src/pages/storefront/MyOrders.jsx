import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, ChevronRight } from 'lucide-react';

const MyOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders.json`);
                const rawData = await response.json();
                const dataArray = rawData ? (Array.isArray(rawData) ? rawData : Object.values(rawData)) : [];
                const userOrders = dataArray.filter(order => order && order.userId === currentUser.id);
                setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
            setLoading(false);
        };

        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle className="status-icon delivered" />;
            case 'shipped': return <Truck className="status-icon shipped" />;
            default: return <Clock className="status-icon pending" />;
        }
    };

    if (loading) return <div className="loading-spinner">Loading Orders...</div>;

    return (
        <div className="profile-container">
            <div className="profile-content full-width">
                <div className="orders-header">
                    <h2>My Orders</h2>
                    <p>Total {orders.length} orders found</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <Package size={64} />
                        <h3>No orders yet</h3>
                        <p>When you buy items, they will appear here!</p>
                        <Link to="/collections" className="browse-btn">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-item-card premium">
                                <div className="order-visual-preview">
                                    <div className="main-item-image">
                                        <img src={order.items[0]?.image} alt={order.items[0]?.name} />
                                        {order.items.length > 1 && (
                                            <div className="item-count-badge">+{order.items.length - 1} More</div>
                                        )}
                                    </div>
                                </div>
                                <div className="order-details-grid">
                                    <div className="order-id-block">
                                        <span className="order-label">Order Reference</span>
                                        <span className="order-value">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="order-date-block">
                                        <span className="order-label">Order Date</span>
                                        <span className="order-value">{new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-status-block">
                                        <span className="order-label">Current Status</span>
                                        <div className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                                            {getStatusIcon(order.status)}
                                            <span>{order.status || 'Pending'}</span>
                                        </div>
                                    </div>
                                    <div className="order-total-block">
                                        <span className="order-label">Total Payment</span>
                                        <span className="order-value amount">{order.total?.toFixed(2)} <small>EGP</small></span>
                                    </div>
                                </div>
                                <div className="order-actions-column">
                                    <button className="view-order-btn">
                                        <span>View Details</span>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
