import React from 'react';
import { useStore } from '../../context/StoreContext';

const Dashboard = () => {
    const { products, categories, banners } = useStore();

    return (
        <div className="admin-dashboard">
            <h2>Dashboard Overview</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Products</div>
                    <div className="stat-value">{products.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Categories</div>
                    <div className="stat-value">{categories.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Active Banners</div>
                    <div className="stat-value">{banners.filter(b => b.active).length}</div>
                </div>
            </div>

            <div className="dashboard-recent">
                <h3>Recent Setup Actions</h3>
                <p>Use the sidebar to manage your store's content. All changes reflect instantly on the storefront.</p>
            </div>
        </div>
    );
};

export default Dashboard;
