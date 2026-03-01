import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Settings, LayoutGrid, MonitorPlay, CreditCard, Plus, Trash2 } from 'lucide-react';

const ManageSettings = () => {
    const { settings } = useStore();
    const { updateSettings } = useAdmin();
    const [activeTab, setActiveTab] = useState('general');

    // New Governorate Form State
    const [newGovName, setNewGovName] = useState('');
    const [newGovPrice, setNewGovPrice] = useState('');
    const [formData, setFormData] = useState({
        marqueeText: '',
        shippingRates: {
            'Cairo': 50,
            'Giza': 50,
            '6th of October': 50,
            'Alexandria': 60,
            'Qalyubia': 60,
            'Sharqia': 60,
            'Dakahlia': 60,
            'Port Said': 70,
            'Suez': 70,
            'Red Sea': 90,
            'Luxor': 80,
            'Aswan': 80,
            'Other': 80
        },
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
                shippingRates: settings.shippingRates || {
                    'Cairo': 50, 'Giza': 50, '6th of October': 50, 'Alexandria': 60,
                    'Qalyubia': 60, 'Sharqia': 60, 'Dakahlia': 60, 'Port Said': 70,
                    'Suez': 70, 'Red Sea': 90, 'Luxor': 80, 'Aswan': 80, 'Other': 80
                },
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

    const handleAddGovernorate = () => {
        if (!newGovName.trim()) return alert("Governorate name cannot be empty.");
        if (formData.shippingRates[newGovName.trim()]) return alert("This Governorate already exists.");

        setFormData(prev => ({
            ...prev,
            shippingRates: {
                ...prev.shippingRates,
                [newGovName.trim()]: Number(newGovPrice) || 0
            }
        }));
        setNewGovName('');
        setNewGovPrice('');
    };

    const handleRemoveGovernorate = (govToRemove) => {
        if (govToRemove === 'Other') return alert("Cannot delete the 'Other' fallback rate.");

        const confirmDelete = window.confirm(`Are you sure you want to remove ${govToRemove}?`);
        if (!confirmDelete) return;

        setFormData(prev => {
            const newRates = { ...prev.shippingRates };
            delete newRates[govToRemove];
            return { ...prev, shippingRates: newRates };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure values are numbers
        const cleanShippingRates = {};
        for (const [gov, cost] of Object.entries(formData.shippingRates)) {
            cleanShippingRates[gov] = Number(cost) || 0;
        }

        await updateSettings({
            marqueeText: formData.marqueeText,
            shippingRates: cleanShippingRates,
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
                            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                Dynamic Shipping Rates (EGP)
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'normal', marginTop: '5px' }}>Set specific shipping costs for each governorate.</span>
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                {Object.keys(formData.shippingRates).map(gov => (
                                    <div key={gov} style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={{ fontSize: '0.95rem', color: '#333', fontWeight: '500' }}>{gov}</label>
                                            {gov !== 'Other' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGovernorate(gov)}
                                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '2px' }}
                                                    title="Remove Governorate"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>EGP</span>
                                            <input
                                                type="number"
                                                value={formData.shippingRates[gov]}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    shippingRates: { ...formData.shippingRates, [gov]: e.target.value }
                                                })}
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Governorate Form */}
                            <div style={{ background: '#f4f6f8', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#334155' }}>Add New Governorate</h4>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder="Governorate Name (e.g. Minya)"
                                        value={newGovName}
                                        onChange={(e) => setNewGovName(e.target.value)}
                                        style={{ flex: '1', minWidth: '150px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Cost (EGP)"
                                        value={newGovPrice}
                                        onChange={(e) => setNewGovPrice(e.target.value)}
                                        style={{ width: '120px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        min="0"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddGovernorate}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--text-main)', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>
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
