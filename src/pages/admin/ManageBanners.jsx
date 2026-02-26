import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Edit, Trash2 } from 'lucide-react';

const ManageBanners = () => {
    const { banners } = useStore();
    const { createBanner, updateBanner, deleteBanner } = useAdmin();
    const [formData, setFormData] = useState({ imageUrl: '', link: '', active: true });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateBanner(editingId, formData);
        } else {
            await createBanner({ ...formData, id: 'b' + Date.now() });
        }
        window.location.reload();
    };

    const handleEdit = (b) => {
        setEditingId(b.id);
        setFormData({ imageUrl: b.imageUrl, link: b.link, active: b.active });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete banner?")) {
            await deleteBanner(id);
            window.location.reload();
        }
    };

    return (
        <div className="manage-page">
            <div className="manage-header">
                <h2>Manage Banners (Hero Sliders)</h2>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result });
                                reader.readAsDataURL(file);
                            }
                        }} />
                        {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                    </div>
                    <input type="text" placeholder="Target Link (e.g. /collections)" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} required />
                </div>
                <div className="checkboxes">
                    <label><input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} /> Active</label>
                </div>
                <button type="submit" className="btn-primary">
                    {editingId ? "Update Banner" : "Add Banner"}
                </button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setFormData({ imageUrl: '', link: '', active: true }) }}>Cancel</button>}
            </form>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Link</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map(b => (
                            <tr key={b.id}>
                                <td><img src={b.imageUrl} alt="Banner" width="120" height="40" style={{ objectFit: 'cover' }} /></td>
                                <td>{b.link}</td>
                                <td>{b.active ? 'Active' : 'Inactive'}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(b)} className="edit-btn"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(b.id)} className="delete-btn"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBanners;
