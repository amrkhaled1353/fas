import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Search, X } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose }) => {
    const { products } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setResults([]);
            return;
        }

        // Focus the input when opened would go here, maybe a ref
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm.trim().length > 1) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [searchTerm, products]);

    if (!isOpen) return null;

    return (
        <div className="search-overlay open" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-header">
                    <div className="search-input-wrap">
                        <Search size={20} className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="icon-btn btn-close-search" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="search-results">
                    {searchTerm.length > 1 && results.length === 0 ? (
                        <div className="no-results">No products found for "{searchTerm}"</div>
                    ) : (
                        results.map(product => (
                            <Link key={product.id} to={`/products/${product.id}`} className="search-result-item" onClick={onClose}>
                                <img src={product.image} alt={product.name} />
                                <div className="search-item-info">
                                    <h4>{product.name}</h4>
                                    <span className="price">{product.price.toFixed(2)} EGP</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
