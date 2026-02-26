import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Flame, Heart, Share2, Eye, Plus, Minus } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, loading, toggleCart, wishlist, toggleWishlist } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState(null);

    if (loading) return <div className="loading">Loading...</div>;

    const product = products.find(p => p.id === productId);

    if (!product) return <div>Product Not Found</div>;

    // Calculate derived data
    const calculatedOldPrice = product.oldPrice ? product.oldPrice : (product.price * 1.4);
    const salePercentage = Math.round(((calculatedOldPrice - product.price) / calculatedOldPrice) * 100);
    const subtotal = (product.price * quantity).toFixed(2);
    const isWished = wishlist.some(item => item.id === product.id);

    const displayImage = mainImage || product.image;
    const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

    // 4 Related Products
    const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
    // If fewer than 4 related, just pad from all products
    const displayRelated = relatedProducts.length >= 4
        ? relatedProducts
        : [...relatedProducts, ...products.filter(p => p.id !== product.id)].slice(0, 4);

    const handleAddToCart = () => {
        // Here we could pass quantity to addToCart if the context supported it, 
        // For now, looping to add multiple or updating context manually
        for (let i = 0; i < quantity; i++) addToCart(product);
        toggleCart(true); // Open slide out cart drawer
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) addToCart(product);
        navigate('/checkout');
    }

    return (
        <div className="pdp-container container">
            {/* Breadcrumbs */}
            <nav className="pdp-breadcrumbs">
                <Link to="/">Home</Link> &gt; <Link to="/collections">Products</Link> &gt; <span>{product.name}</span>
            </nav>

            <div className="pdp-main">
                {/* Left: Image */}
                <div className="pdp-image-col">
                    <div className="pdp-image-wrapper">
                        <span className="pdp-badge">Sale {salePercentage}%</span>
                        <img key={displayImage} src={displayImage} alt={product.name} className="animate-fade" />
                    </div>
                    {/* Thumbnail Gallery */}
                    {allImages.length > 1 && (
                        <div className="pdp-thumbnails">
                            {allImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`thumb-${idx}`}
                                    className={displayImage === img ? 'active-thumb' : ''}
                                    onClick={() => setMainImage(img)}
                                    style={{ cursor: 'pointer', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="pdp-info-col">
                    <h1 className="pdp-title">{product.name}</h1>

                    <div className="pdp-sold-hurry">
                        <Flame size={16} className="flame-icon" color="#e74c3c" />
                        <span>8 sold in last 16 hours</span>
                    </div>

                    <p className="pdp-short-desc">
                        {product.description || "Scent inspired by premium fragrance body splash."}
                    </p>

                    <div className="pdp-meta">
                        <p><span>Vendor:</span> ARTMED</p>
                        <p><span>Availability:</span> In stock</p>
                    </div>

                    <div className="pdp-price-block">
                        <span className="old-price">{calculatedOldPrice.toFixed(2)}</span>
                        <span className="current-price">{product.price.toFixed(2)}</span>
                    </div>

                    {(product.stock !== undefined && product.stock > 0 && product.stock <= 10) && (
                        <div className="pdp-stock-urgency">
                            <p className="urgency-text">Please hurry! Only {product.stock} left in stock</p>
                            <div className="urgency-bar">
                                <div className="urgency-fill" style={{ width: `${Math.max(10, (product.stock / 10) * 100)}%` }}></div>
                            </div>
                        </div>
                    )}

                    <div className="pdp-quantity-wrap">
                        <label>Quantity:</label>
                        <div className="pdp-quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                        </div>
                    </div>

                    <div className="pdp-subtotal">
                        <span>Subtotal:</span> {subtotal} EGP
                    </div>

                    <div className="pdp-actions">
                        <div className="pdp-primary-actions">
                            <button className="btn-add-cart" onClick={handleAddToCart}>ADD TO CART</button>
                            <button className={`btn-icon-sq ${isWished ? 'wished' : ''}`} onClick={() => toggleWishlist(product)}>
                                <Heart size={20} fill={isWished ? '#e74c3c' : 'none'} color={isWished ? '#e74c3c' : 'currentColor'} />
                            </button>
                            <button className="btn-icon-sq"><Share2 size={20} /></button>
                        </div>
                        <button className="btn-buy-now" onClick={handleBuyNow}>BUY IT NOW</button>
                    </div>

                    <div className="pdp-viewing">
                        <Eye size={16} /> <span>10 customers are viewing this product</span>
                    </div>
                </div>
            </div>

            {/* Bottom: Tabs & Related */}
            <div className="pdp-bottom-section">
                <div className="pdp-tabs">
                    <button
                        className={`pdp-tab ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`pdp-tab ${activeTab === 'shipping' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        Shipping & Return
                    </button>
                </div>

                <div className="pdp-tab-content">
                    {activeTab === 'description' && (
                        <div className="tab-pane animate-fade-in-up">
                            <p>{product.name}</p>
                            <br />
                            <p>{product.description || "Scent inspired by premium fragrance body splash."}</p>
                            <br />
                            <p>body splash</p>
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                        <div className="tab-pane animate-fade-in-up">
                            <p>Shipping takes 2-4 business days. Returns are accepted within 14 days of receiving your order.</p>
                        </div>
                    )}
                </div>

                <div className="pdp-related">
                    <h3>RELATED PRODUCTS</h3>
                    <div className="products-grid">
                        {displayRelated.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
