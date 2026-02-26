import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Edit, Trash2, Plus } from 'lucide-react';

const ManageProducts = () => {
    const { products, categories } = useStore();
    const { createProduct, updateProduct, deleteProduct } = useAdmin();
    const [formData, setFormData] = useState({ name: '', price: '', oldPrice: '', stock: '', image: '', images: [], categoryId: '', description: '', isTrending: false, isPopular: false });
    const [editingId, setEditingId] = useState(null);

    // Helper to compress images before saving them as base64 to prevent json-server payload errors
    const compressImage = (file, maxWidth = 800) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ratio = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% JPEG
                };
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: Number(formData.price),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
            stock: formData.stock ? Number(formData.stock) : 0,
            images: formData.images || []
        };
        if (editingId) {
            await updateProduct(editingId, data);
        } else {
            await createProduct({ ...data, id: 'p' + Date.now() });
        }
        window.location.reload();
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setFormData({ name: p.name, price: p.price, oldPrice: p.oldPrice || '', stock: p.stock || '', image: p.image || '', images: p.images || [], categoryId: p.categoryId, description: p.description, isTrending: p.isTrending, isPopular: p.isPopular });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete product?")) {
            await deleteProduct(id);
            window.location.reload();
        }
    };

    return (
        <div className="manage-page">
            <div className="manage-header">
                <h2>Manage Products</h2>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" placeholder="Price (EGP)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={{ flex: 1 }} />
                        <input type="number" placeholder="Old Price (Optional)" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} style={{ flex: 1 }} />
                        <input type="number" placeholder="Stock Qty" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required style={{ flex: 1 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Main Product Image (Required)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="file" accept="image/*" onChange={async e => {
                                const file = e.target.files[0];
                                if (file) {
                                    const compressedBase64 = await compressImage(file);
                                    setFormData({ ...formData, image: compressedBase64 });
                                }
                            }} />
                            {formData.image && <img src={formData.image} alt="Main Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Gallery Images (Optional - Multiple)</label>
                        <input type="file" accept="image/*" multiple onChange={async e => {
                            const files = Array.from(e.target.files);
                            for (const file of files) {
                                const compressedBase64 = await compressImage(file);
                                setFormData(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
                            }
                        }} />
                        {formData.images && formData.images.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <img src={img} alt="Gallery Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', zIndex: 1 }}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                <div className="checkboxes">
                    <label><input type="checkbox" checked={formData.isTrending} onChange={e => setFormData({ ...formData, isTrending: e.target.checked })} /> Trending Now</label>
                    <label><input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({ ...formData, isPopular: e.target.checked })} /> Popular Product</label>
                </div>
                <button type="submit" className="btn-primary">
                    {editingId ? "Update Product" : "Add Product"}
                </button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', oldPrice: '', stock: '', image: '', images: [], categoryId: '', description: '', isTrending: false, isPopular: false }) }}>Cancel</button>}
            </form>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.image} alt={p.name} width="50" height="50" /></td>
                                <td>{p.name}</td>
                                <td>{p.price} EGP</td>
                                <td>{categories.find(c => c.id === p.categoryId)?.name}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(p)} className="edit-btn"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="delete-btn"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
