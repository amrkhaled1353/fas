import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, toggleCart, wishlist, toggleWishlist } = useStore();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigating to product details if card is wrapped in a Link
        e.stopPropagation();
        addToCart(product);
        toggleCart(true);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const oldPrice = product.oldPrice ? product.oldPrice : (product.price * 1.4);
    const salePercentage = Math.round(((oldPrice - product.price) / oldPrice) * 100);
    const isWished = wishlist?.some(item => item.id === product.id);

    return (
        <div className="product-card">
            <Link to={`/products/${product.id}`}>
                <div className="product-image">
                    <span className="card-badge">Sale {salePercentage}%</span>

                    <button className="card-wishlist-btn" onClick={handleWishlistToggle}>
                        <Heart size={18} fill={isWished ? '#e74c3c' : 'none'} color={isWished ? '#e74c3c' : 'currentColor'} />
                    </button>

                    <img src={product.image} alt={product.name} />

                    {/* Hover Overlay Button */}
                    <div className="product-hover-action">
                        <button className="hover-add-to-cart" onClick={handleAddToCart}>
                            ADD TO CART
                        </button>
                    </div>
                </div>
                <div className="product-info">
                    <p className="vendor-name">SGS</p>
                    <h4>{product.name}</h4>
                    <div className="card-price-block">
                        <span className="card-old-price">{oldPrice.toFixed(2)}</span>
                        <span className="card-current-price">{product.price.toFixed(2)}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
