import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, ShoppingBag, Truck, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, updateCartQuantity, removeFromCart, isCartOpen, toggleCart, products, addToCart, settings } = useStore();
    const navigate = useNavigate();

    // For the 'You May Also Like' slider

    // Close drawer on escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') toggleCart(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [toggleCart]);

    // if (!isCartOpen) return null; // Removed so it stays in DOM for CSS transitions

    const subtotalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotal = subtotalValue.toFixed(2);
    const shipping = subtotalValue > 0 ? (settings?.shippingCost || 0) : 0;
    const total = (subtotalValue + shipping).toFixed(2);
    const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // For the 'You May Also Like' slider
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState('animate-fade');

    // You May Also Like (Mock items that are not in cart)
    const cartItemIds = cart.map(item => item.id);
    const recommendations = products.filter(p => !cartItemIds.includes(p.id)).slice(0, 3);
    const currentRecommendation = recommendations[currentSlide];

    const nextSlide = () => {
        setSlideDirection('animate-slide-in-right');
        setCurrentSlide((prev) => (prev + 1) % recommendations.length);
    };

    const prevSlide = () => {
        setSlideDirection('animate-slide-in-left');
        setCurrentSlide((prev) => (prev - 1 + recommendations.length) % recommendations.length);
    };

    const handleCheckoutClick = () => {
        toggleCart(false);
        navigate('/checkout');
    };

    const handleViewCartClick = () => {
        toggleCart(false);
        navigate('/cart');
    };

    return (
        <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => toggleCart(false)}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cart-drawer-header">
                    <div>
                        <h2>Shopping Cart</h2>
                        <p className="item-count">{totalItemCount} item{totalItemCount !== 1 ? 's' : ''}</p>
                    </div>
                    <button className="close-cart-btn" onClick={() => toggleCart(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div key={`items-${isCartOpen}`} className={`cart-drawer-items ${isCartOpen ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
                    {cart.length === 0 ? (
                        <div className="empty-cart-msg">Your cart is empty.</div>
                    ) : (
                        cart.map((item) => {
                            const oldPrice = (item.price * 1.4).toFixed(2); // Mock original price
                            return (
                                <div key={item.id} className="cart-drawer-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <div className="cart-item-price-block">
                                            <span className="cart-old-price">{oldPrice}</span>
                                            <span className="cart-current-price">{item.price.toFixed(2)}</span>
                                        </div>

                                        <div className="cart-item-actions">
                                            <div className="cart-quantity-controls">
                                                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {/* You May Also Like Section moved INSIDE the scrollable items container */}
                    {recommendations.length > 0 && (
                        <div key={`recs-${isCartOpen}`} className={`cart-drawer-recommendations ${isCartOpen ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                            <div className="recommendation-header">
                                <h3>You May Also Like</h3>
                                <div className="recommendation-nav">
                                    <button onClick={prevSlide}><ChevronLeft size={16} /></button>
                                    <button onClick={nextSlide}><ChevronRight size={16} /></button>
                                </div>
                            </div>

                            {currentRecommendation && (
                                <div key={`${currentRecommendation.id}-${slideDirection}`} className={`recommendation-card ${slideDirection}`}>
                                    <img src={currentRecommendation.image} alt={currentRecommendation.name} />
                                    <div className="recommendation-info">
                                        <h4>{currentRecommendation.name}</h4>
                                        <div className="cart-item-price-block">
                                            <span className="cart-current-price">{currentRecommendation.price.toFixed(2)}</span>
                                        </div>
                                        <button className="add-recommendation-btn" onClick={() => addToCart(currentRecommendation)}>
                                            ADD TO CART
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div key={`footer-${isCartOpen}`} className={`cart-drawer-footer ${isCartOpen ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                    {/* Icons Bar */}
                    <div className="cart-drawer-icons">
                        <button className="cart-icon-btn"><ShoppingBag size={20} /></button>
                        <button className="cart-icon-btn"><Truck size={20} /></button>
                        <button className="cart-icon-btn"><Tag size={20} /></button>
                    </div>

                    <div className="cart-drawer-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span className="summary-value">{subtotal} EGP</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total:</span>
                            <span className="summary-value">{total} EGP</span>
                        </div>
                    </div>

                    <p className="cart-tax-note">Tax included, {settings?.shippingCost || 0} EGP shipping added</p>

                    <div className="cart-drawer-buttons">
                        <button className="drawer-checkout-btn" onClick={handleCheckoutClick}>CHECKOUT</button>
                        <button className="drawer-viewcart-btn" onClick={handleViewCartClick}>VIEW CART</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
