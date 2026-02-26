import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Edit, Trash2 } from 'lucide-react';

const ManageCategories = () => {
    const { categories } = useStore();
    const { createCategory, updateCategory, deleteCategory } = useAdmin();
    const [formData, setFormData] = useState({ name: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateCategory(editingId, formData);
        } else {
            await createCategory({ ...formData, id: 'c' + Date.now() });
        }
        window.location.reload();
    };

    const handleEdit = (c) => {
        setEditingId(c.id);
        setFormData({ name: c.name, image: c.image });
        setImagePreview(c.image);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete category?")) {
            await deleteCategory(id);
            window.location.reload();
        }
    };

    return (
        <div className="manage-page">
            <div className="manage-header">
                <h2>Manage Categories</h2>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input type="text" placeholder="Category Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <div className="image-upload-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1 }} />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                    </div>
                </div>
                <button type="submit" className="btn-primary">
                    {editingId ? "Update Category" : "Add Category"}
                </button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', image: '' }); setImagePreview(''); }}>Cancel</button>}
            </form>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td><img src={c.image} alt={c.name} width="50" height="50" /></td>
                                <td>{c.name}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(c)} className="edit-btn"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="delete-btn"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCategories;
