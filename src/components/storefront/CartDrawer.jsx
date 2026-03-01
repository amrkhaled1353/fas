import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, ShoppingBag, Truck, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const defaultShippingRates = {
    'Cairo': 50,
    'Giza': 50,
    '6th of October': 50,
    'Alexandria': 60,
    'Qalyubia': 60,
    'Sharqia': 60,
    'Dakahlia': 60,
    'Port Said': 70,
    'Suez': 70,
    'Red Sea': 90,
    'Luxor': 80,
    'Aswan': 80,
    'Other': 80
};

const CartDrawer = () => {
    const {
        cart,
        updateCartQuantity,
        removeFromCart,
        isCartOpen,
        toggleCart,
        products,
        addToCart,
        settings,
        coupons,
        checkoutNote,
        setCheckoutNote,
        activeDiscount,
        setActiveDiscount,
        selectedGovernorate,
        setSelectedGovernorate
    } = useStore();
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

    // Calculate shipping based on selected governorate, else fallback to default shipping cost
    const activeRates = settings?.shippingRates || defaultShippingRates;
    const govToUse = selectedGovernorate || 'Cairo';
    let shipping = activeRates[govToUse] !== undefined ? Number(activeRates[govToUse]) : (activeRates['Other'] || 50);

    // Apply discount
    let finalTotalValue = subtotalValue + shipping;
    if (activeDiscount) {
        finalTotalValue -= activeDiscount.amount;
        if (finalTotalValue < 0) finalTotalValue = 0; // Prevent negative total
    }
    const total = finalTotalValue.toFixed(2);

    const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // For the 'You May Also Like' slider
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState('animate-fade');

    // Footer Accordion State
    const [activeTab, setActiveTab] = useState(null); // 'note', 'shipping', 'coupon', or null
    const [orderNoteLocal, setOrderNoteLocal] = useState(checkoutNote || '');
    const [couponCode, setCouponCode] = useState('');
    const [localGov, setLocalGov] = useState(selectedGovernorate || 'Cairo');

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

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            setActiveDiscount(null);
            setActiveTab(null);
            alert('Coupon code cannot be empty. Discount removed.');
            return;
        }

        const validCoupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (validCoupon) {
            let discountAmount = 0;
            if (validCoupon.type === 'percentage') {
                discountAmount = subtotalValue * (parseFloat(validCoupon.discount) / 100);
            } else {
                discountAmount = parseFloat(validCoupon.discount);
            }
            setActiveDiscount({ code: validCoupon.code, amount: discountAmount });
            alert(`Coupon '${validCoupon.code}' applied successfully!`);
            setActiveTab(null);
        } else {
            setActiveDiscount(null); // Clear any previous discount if new code is invalid
            alert('Invalid coupon code. Please try again.');
        }
    };

    const handleSaveNote = () => {
        setCheckoutNote(orderNoteLocal);
        setActiveTab(null);
    };

    const handleCalculateShipping = () => {
        setSelectedGovernorate(localGov);
        setActiveTab(null);
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
        <>
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

                        {/* You May Also Like Section */}
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

                        {/* Icons Bar Minimal */}
                        <div className="cart-drawer-icons-minimal">
                            <button className={`cart-icon-btn ${activeTab === 'note' ? 'active' : ''}`} onClick={() => setActiveTab(activeTab === 'note' ? null : 'note')} title="Add Note">
                                <ShoppingBag size={18} />
                                <span>Note</span>
                            </button>
                            <button className={`cart-icon-btn ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')} title="Estimate Shipping">
                                <Truck size={18} />
                                <span>Shipping</span>
                            </button>
                            <button className={`cart-icon-btn ${activeTab === 'coupon' ? 'active' : ''}`} onClick={() => setActiveTab(activeTab === 'coupon' ? null : 'coupon')} title="Apply Coupon">
                                <Tag size={18} />
                                <span>Coupon</span>
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="cart-drawer-summary">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span className="summary-value">{subtotal} EGP</span>
                            </div>
                            {activeDiscount && (
                                <div className="summary-row" style={{ color: '#e74c3c' }}>
                                    <span>Discount ({activeDiscount.code}):</span>
                                    <span className="summary-value">-{activeDiscount.amount.toFixed(2)} EGP</span>
                                </div>
                            )}
                            <div className="summary-row total-row">
                                <span>Total:</span>
                                <span className="summary-value">{total} EGP</span>
                            </div>
                        </div>
                        <p className="cart-tax-note">Tax included. {shipping} EGP shipping added</p>
                        <div className="cart-drawer-buttons">
                            <button className="drawer-checkout-btn" onClick={handleCheckoutClick}>CHECKOUT</button>
                            <button className="drawer-viewcart-btn" onClick={handleViewCartClick}>VIEW CART</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Popup Modal */}
            {activeTab && (
                <div className="feature-popup-overlay animate-fade" onClick={() => setActiveTab(null)}>
                    <div className="feature-popup-content animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                        {activeTab === 'note' && (
                            <div className="cart-accordion-content">
                                <div className="accordion-header">
                                    <ShoppingBag size={18} />
                                    <h4>Order Special Instructions</h4>
                                </div>
                                <textarea
                                    value={orderNoteLocal}
                                    onChange={(e) => setOrderNoteLocal(e.target.value)}
                                    placeholder="Order special instructions"
                                />
                                <div className="accordion-actions">
                                    <button className="accordion-save-btn" onClick={handleSaveNote}>SAVE</button>
                                    <button className="accordion-cancel-btn" onClick={() => setActiveTab(null)}>CANCEL</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="cart-accordion-content">
                                <div className="accordion-header">
                                    <Truck size={18} />
                                    <h4>Estimate Shipping Rates</h4>
                                </div>

                                <label>Country/Region</label>
                                <select defaultValue="Egypt">
                                    <option value="Egypt">Egypt</option>
                                </select>

                                <label>State</label>
                                <select value={localGov} onChange={(e) => setLocalGov(e.target.value)}>
                                    {Object.keys(settings?.shippingRates || defaultShippingRates).map(gov => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>

                                <label>ZIP Code</label>
                                <input type="text" placeholder="Postal code" />

                                <div className="accordion-actions">
                                    <button className="accordion-save-btn" onClick={handleCalculateShipping}>CALCULATE SHIPPING</button>
                                    <button className="accordion-cancel-btn" onClick={() => setActiveTab(null)}>CANCEL</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'coupon' && (
                            <div className="cart-accordion-content">
                                <div className="accordion-header">
                                    <Tag size={18} />
                                    <h4>Add A Coupon</h4>
                                </div>
                                <p className="coupon-subtitle">Coupon code content</p>
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                />
                                <div className="accordion-actions">
                                    <button className="accordion-save-btn" onClick={handleApplyCoupon}>SAVE</button>
                                    <button className="accordion-cancel-btn" onClick={() => { setActiveTab(null); setCouponCode(''); }}>CANCEL</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CartDrawer;
