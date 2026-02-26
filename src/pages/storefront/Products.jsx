import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../../components/storefront/ProductCard';

const Products = () => {
    const { categoryId } = useParams();
    const { products, categories, loading } = useStore();
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    // Filter by Category
    let filteredProducts = categoryId
        ? products.filter(p => p.categoryId === categoryId)
        : products;

    // Filter by Price
    if (minPrice !== '') {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    const categoryName = categoryId
        ? categories.find(c => c.id === categoryId)?.name || 'Category'
        : 'All Products';

    return (
        <div className="products-page container">
            <div className="archive-layout">
                {/* Mobile Filter Toggle Button */}
                <div className="mobile-filter-header">
                    <button className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>
                        Filter & Sort
                    </button>
                    <span className="mobile-product-count">{filteredProducts.length} products</span>
                </div>

                {/* Sidebar Overlay for Mobile */}
                <div className={`filter-overlay ${isFilterOpen ? 'open' : ''}`} onClick={() => setIsFilterOpen(false)}>
                    <aside className="archive-sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-sidebar-header">
                            <h3>Filters</h3>
                            <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <div className="filter-widget animate-fade-in-up">
                            <h3>Categories</h3>
                            <ul className="category-filter-list">
                                <li>
                                    <Link to="/collections" onClick={() => setIsFilterOpen(false)} className={!categoryId ? 'active' : ''}>All Products</Link>
                                </li>
                                {categories.map(c => (
                                    <li key={c.id}>
                                        <Link to={`/collections/${c.id}`} onClick={() => setIsFilterOpen(false)} className={categoryId === c.id ? 'active' : ''}>
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-widget animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h3>Filter by Price</h3>
                            <div className="price-filter-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Main Content */}
                <div className="archive-main">
                    <div className="archive-header">
                        <h2>{categoryName}</h2>
                        <span>{filteredProducts.length} products</span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid animate-fade-in-up" key={categoryId || 'all'}>
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products-msg">
                            <p>No products found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
