import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Settings, LayoutGrid, MonitorPlay, CreditCard } from 'lucide-react';

const ManageSettings = () => {
    const { settings } = useStore();
    const { updateSettings } = useAdmin();
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        marqueeText: '',
        shippingCost: 0,
        desktopColumns: 4,
        mobileColumns: 2,
        productDisplayMode: 'grid',
        heroDesktopHeight: '65vh',
        heroMobileHeight: '40vh',
        paymobApiKey: '',
        paymobIntegrationId: '',
        paymobIframeId: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                marqueeText: settings.marqueeText || '',
                shippingCost: settings.shippingCost || 0,
                desktopColumns: settings.desktopColumns || 4,
                mobileColumns: settings.mobileColumns || 2,
                productDisplayMode: settings.productDisplayMode || 'grid',
                heroDesktopHeight: settings.heroDesktopHeight || '65vh',
                heroMobileHeight: settings.heroMobileHeight || '40vh',
                paymobApiKey: settings.paymobApiKey || '',
                paymobIntegrationId: settings.paymobIntegrationId || '',
                paymobIframeId: settings.paymobIframeId || ''
            });
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSettings({
            marqueeText: formData.marqueeText,
            shippingCost: Number(formData.shippingCost),
            desktopColumns: Number(formData.desktopColumns),
            mobileColumns: Number(formData.mobileColumns),
            productDisplayMode: formData.productDisplayMode,
            heroDesktopHeight: formData.heroDesktopHeight,
            heroMobileHeight: formData.heroMobileHeight,
            paymobApiKey: formData.paymobApiKey,
            paymobIntegrationId: formData.paymobIntegrationId,
            paymobIframeId: formData.paymobIframeId
        });
        alert('Settings updated successfully!');
        window.location.reload();
    };

    return (
        <div className="manage-page">
            <div className="manage-header">
                <h2>Store Settings</h2>
            </div>

            <div className="admin-tabs-container" style={{ marginBottom: '30px' }}>
                <div className="admin-tabs" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    <button
                        className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: activeTab === 'general' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'general' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'general' ? '600' : '400', marginBottom: '-11px' }}
                    >
                        <Settings size={18} /> General
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'layout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('layout')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: activeTab === 'layout' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'layout' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'layout' ? '600' : '400', marginBottom: '-11px' }}
                    >
                        <LayoutGrid size={18} /> Layout
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hero')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: activeTab === 'hero' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'hero' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'hero' ? '600' : '400', marginBottom: '-11px' }}
                    >
                        <MonitorPlay size={18} /> Hero Slider
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'payment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payment')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: activeTab === 'payment' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'payment' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'payment' ? '600' : '400', marginBottom: '-11px' }}
                    >
                        <CreditCard size={18} /> Payment
                    </button>
                </div>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                {activeTab === 'general' && (
                    <div className="tab-pane animate-fade-in-up">
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Top Announcement Marquee Text</label>
                            <textarea
                                value={formData.marqueeText}
                                onChange={e => setFormData({ ...formData, marqueeText: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                                placeholder="Enter announcement text here... Use a new line for each sentence."
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Shipping Cost (EGP)</label>
                            <input
                                type="number"
                                value={formData.shippingCost}
                                onChange={e => setFormData({ ...formData, shippingCost: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                min="0"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'layout' && (
                    <div className="tab-pane animate-fade-in-up">
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Desktop Product Columns</label>
                            <input
                                type="number"
                                value={formData.desktopColumns}
                                onChange={e => setFormData({ ...formData, desktopColumns: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                min="1"
                                max="6"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mobile Product Columns</label>
                            <input
                                type="number"
                                value={formData.mobileColumns}
                                onChange={e => setFormData({ ...formData, mobileColumns: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                min="1"
                                max="3"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Display Mode (Home Page)</label>
                            <select
                                value={formData.productDisplayMode}
                                onChange={e => setFormData({ ...formData, productDisplayMode: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="grid">Grid</option>
                                <option value="slider">Slider (Carousel)</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="tab-pane animate-fade-in-up">
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Slider Desktop Height</label>
                            <input
                                type="text"
                                value={formData.heroDesktopHeight}
                                onChange={e => setFormData({ ...formData, heroDesktopHeight: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="e.g. 65vh, 500px, 100%"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hero Slider Mobile Height</label>
                            <input
                                type="text"
                                value={formData.heroMobileHeight}
                                onChange={e => setFormData({ ...formData, heroMobileHeight: e.target.value })}
                                style={{ width: '100%', maxWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="e.g. 40vh, 300px, 100%"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'payment' && (
                    <div className="tab-pane animate-fade-in-up">
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Paymob API Key</label>
                            <input
                                type="text"
                                value={formData.paymobApiKey}
                                onChange={e => setFormData({ ...formData, paymobApiKey: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="Enter your Paymob API Key"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Paymob Integration ID</label>
                            <input
                                type="text"
                                value={formData.paymobIntegrationId}
                                onChange={e => setFormData({ ...formData, paymobIntegrationId: e.target.value })}
                                style={{ width: '100%', maxWidth: '300px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="e.g., 4012345"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Paymob Iframe ID</label>
                            <input
                                type="text"
                                value={formData.paymobIframeId}
                                onChange={e => setFormData({ ...formData, paymobIframeId: e.target.value })}
                                style={{ width: '100%', maxWidth: '300px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="e.g., 812345"
                            />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px', padding: '15px', background: 'var(--surface-light)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                            <strong>Note:</strong> These credentials will be stored securely and used later to integrate the real Paymob checkout when you add a real backend server.
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button type="submit" className="btn-primary">Save All Settings</button>
                </div>
            </form>
        </div>
    );
};

export default ManageSettings;
