import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../../components/storefront/ProductCard';
import { HeartCrack } from 'lucide-react';

const WishlistPage = () => {
    const { wishlist } = useStore();

    return (
        <div className="container wishlist-page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <div className="page-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My Wishlist</h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Your favorite items saved for later.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '16px' }}>
                    <HeartCrack size={64} color="#ccc" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Your wishlist is empty</h2>
                    <p style={{ color: '#777', marginBottom: '25px' }}>You haven't added any products to your wishlist yet.</p>
                    <Link to="/collections" className="btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="products-grid">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
