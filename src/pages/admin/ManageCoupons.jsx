import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Tag } from 'lucide-react';

const ManageCoupons = () => {
    const { coupons } = useStore();
    const { createCoupon, deleteCoupon } = useAdmin();
    const [couponList, setCouponList] = useState([]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount: '',
        type: 'percentage' // or 'fixed'
    });

    useEffect(() => {
        setCouponList(coupons);
    }, [coupons]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const res = await createCoupon(newCoupon);
            setCouponList([...couponList, { id: res.name, ...newCoupon }]);
            setNewCoupon({ code: '', discount: '', type: 'percentage' });
            setIsFormOpen(false);
            alert("Coupon created successfully! Refresh the storefront to test it.");
        } catch (error) {
            alert("Error creating coupon.");
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await deleteCoupon(id);
                setCouponList(couponList.filter(c => c.id !== id));
            } catch (error) {
                alert("Error deleting coupon.");
            }
        }
    };

    return (
        <div className="admin-page animate-fade">
            <div className="admin-header">
                <h2>Manage Coupons</h2>
                <button className="btn-primary" onClick={() => setIsFormOpen(!isFormOpen)}>
                    <Plus size={18} /> Add Coupon
                </button>
            </div>

            {isFormOpen && (
                <div className="admin-card mb-20 animate-fade">
                    <form onSubmit={handleCreateCoupon} className="admin-form">
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <input
                                type="text"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. SUMMER20"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Discount Amount</label>
                                <input
                                    type="number"
                                    value={newCoupon.discount}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount Type</label>
                                <select
                                    value={newCoupon.type}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (EGP)</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Save Coupon</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                {couponList.length === 0 ? (
                    <div className="empty-state">
                        <Tag size={40} className="empty-icon" />
                        <p>No active coupons found.</p>
                        <p className="empty-subtitle">Create a coupon code to offer discounts to your customers.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {couponList.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td><strong>{coupon.code}</strong></td>
                                    <td>{coupon.discount}</td>
                                    <td>{coupon.type === 'percentage' ? '%' : 'EGP'}</td>
                                    <td className="table-actions">
                                        <button className="action-btn delete" onClick={() => handleDeleteCoupon(coupon.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageCoupons;
