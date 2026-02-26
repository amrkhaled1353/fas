import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, CheckCircle, Clock, Truck, XCircle, Trash2 } from 'lucide-react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders.json`);
            const rawData = await response.json();
            const dataArray = rawData ? (Array.isArray(rawData) ? rawData : Object.values(rawData)).filter(Boolean) : [];
            // Sort to put pending orders first, then sort by date descending
            const sortedData = dataArray.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.date) - new Date(a.date);
            });
            setOrders(sortedData);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders/${orderId}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error("Error updating order status:", err);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to permanently delete this order?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders/${orderId}.json`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchOrders();
                }
            } catch (err) {
                console.error("Error deleting order:", err);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'delivered': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return <div className="admin-loading">Loading Management...</div>;

    return (
        <div className="admin-page premium-orders-management">
            <div className="admin-header premium-header">
                <div className="header-title">
                    <div className="icon-wrapper glass">
                        <ShoppingBag size={24} color="#000" />
                    </div>
                    <div>
                        <h2>Manage Orders</h2>
                        <p className="subtitle">Track and update customer order statuses</p>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="premium-search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="premium-filter-box">
                        <Filter size={18} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="orders-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order Details</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
                                            <img src={order.items[0]?.image} alt={order.items[0]?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <span className="id-tag">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#000' }}>{order.customerInfo.firstName} {order.customerInfo.lastName}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777', marginTop: '4px' }}>{order.customerInfo.phone}</div>
                                    </div>
                                </td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td style={{ fontWeight: '800', fontSize: '1.05rem' }}>{order.total?.toFixed(2)} EGP</td>
                                <td>
                                    <div className={`status-pill ${order.status?.toLowerCase() || 'pending'}`} style={{ gap: '6px' }}>
                                        {getStatusIcon(order.status)}
                                        <span>{order.status || 'Pending'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <select
                                            className="status-select"
                                            value={order.status || 'pending'}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="delete-order-btn"
                                            title="Delete Order"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="premium-empty-state">
                        <ShoppingBag size={48} opacity={0.2} />
                        <p>No orders found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
