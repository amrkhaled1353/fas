import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, Home, Settings, ShoppingBag, Users } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders.json`);
                if (response.ok) {
                    const rawData = await response.json();
                    const dataArray = rawData ? (Array.isArray(rawData) ? rawData : Object.values(rawData)) : [];
                    const pendingOrders = dataArray.filter(o => o && o.status === 'pending');
                    setPendingOrdersCount(pendingOrders.length);
                }
            } catch (err) {
                console.error("Error fetching pending orders:", err);
            }
        };

        fetchPendingOrders();
        // Set up an interval to check for new orders periodically
        const interval = setInterval(fetchPendingOrders, 30000); // every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="admin-app">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/products" className={location.pathname.includes('/admin/products') ? 'active' : ''}>
                                <Package size={20} /> Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/categories" className={location.pathname.includes('/admin/categories') ? 'active' : ''}>
                                <FolderTree size={20} /> Categories
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orders" className={location.pathname.includes('/admin/orders') ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <ShoppingBag size={20} /> Orders
                                </div>
                                {pendingOrdersCount > 0 && (
                                    <span className="nav-badge">{pendingOrdersCount}</span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/users" className={location.pathname.includes('/admin/users') ? 'active' : ''}>
                                <Users size={20} /> Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/settings" className={location.pathname.includes('/admin/settings') ? 'active' : ''}>
                                <Settings size={20} /> Settings
                            </Link>
                        </li>
                        <li className="nav-divider"></li>
                        <li>
                            <Link to="/">
                                <Home size={20} /> View Store
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-title">
                        <h3>Store Management</h3>
                    </div>
                    <div className="topbar-actions">
                        <span>Admin User</span>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
