import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
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
    'Other': 80 // Default fallback
};

const CheckoutPage = () => {
    const { cart, clearCart, checkoutNote, activeDiscount, setActiveDiscount, setCheckoutNote, coupons, settings } = useStore();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [formData, setFormData] = useState({
        email: currentUser?.email || '',
        newsletter: true,
        country: 'Egypt',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        governorate: 'Cairo',
        postalCode: '',
        phone: '',
        saveInfo: false,
        payment: 'cod'
    });

    const activeRates = settings?.shippingRates || defaultShippingRates;
    const governoratesList = Object.keys(activeRates);

    const [shippingCost, setShippingCost] = useState(activeRates['Cairo'] || 50);

    // Update shipping cost when governorate changes
    useEffect(() => {
        const rate = activeRates[formData.governorate] || activeRates['Other'] || 50;
        setShippingCost(rate);
    }, [formData.governorate, activeRates]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let finalTotalValue = subtotal + shippingCost;
    if (activeDiscount) {
        finalTotalValue -= activeDiscount.amount;
        if (finalTotalValue < 0) finalTotalValue = 0;
    }

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponInput.trim()) {
            setActiveDiscount(null);
            alert('Coupon code cannot be empty.');
            return;
        }

        const validCoupon = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
        if (validCoupon) {
            let discountAmount = 0;
            if (validCoupon.type === 'percentage') {
                discountAmount = subtotal * (parseFloat(validCoupon.discount) / 100);
            } else {
                discountAmount = parseFloat(validCoupon.discount);
            }
            setActiveDiscount({ code: validCoupon.code, amount: discountAmount });
            alert(`Coupon '${validCoupon.code}' applied successfully!`);
            setCouponInput('');
        } else {
            setActiveDiscount(null);
            alert('Invalid coupon code. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const orderData = {
            id: 'ORD-' + uniqueId,
            userId: currentUser?.id || 'guest',
            customerInfo: formData,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            note: checkoutNote || '',
            discount: activeDiscount ? { code: activeDiscount.code, amount: activeDiscount.amount } : null,
            subtotal: subtotal,
            shipping: shippingCost,
            total: finalTotalValue,
            date: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/orders/${orderData.id}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                clearCart();
                setActiveDiscount(null);
                setCheckoutNote('');
                navigate(currentUser ? '/profile/orders' : '/');
            } else {
                throw new Error("Failed to place order");
            }
        } catch (err) {
            alert("Error placing order: " + err.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <Link to="/collections" className="place-order-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Return to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-layout">

                {/* LEFT COLUMN: FORM */}
                <div className="checkout-form-section">
                    <form onSubmit={handleSubmit} className="checkout-form">

                        {/* Contact Section */}
                        <div className="checkout-section-header">
                            <h2 className="form-group-title" style={{ marginTop: 0 }}>Contact</h2>
                            {!currentUser && <Link to="/login">Sign in</Link>}
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email or mobile phone number"
                            className="checkout-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label className="checkout-checkbox">
                            <input
                                type="checkbox"
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleChange}
                            />
                            Email me with news and offers
                        </label>

                        {/* Delivery Section */}
                        <h2 className="form-group-title">Delivery</h2>

                        <div className="checkout-select-wrapper">
                            <select name="country" className="checkout-input" value={formData.country} onChange={handleChange} required>
                                <option value="Egypt">Egypt</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <input type="text" name="firstName" placeholder="First name" className="checkout-input" value={formData.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last name" className="checkout-input" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <input type="text" name="address" placeholder="Address" className="checkout-input" value={formData.address} onChange={handleChange} required />

                        <div className="form-row-3">
                            <input type="text" name="city" placeholder="City" className="checkout-input" value={formData.city} onChange={handleChange} required />

                            <div className="checkout-select-wrapper">
                                <select name="governorate" className="checkout-input" value={formData.governorate} onChange={handleChange} required>
                                    <option value="" disabled>Governorate</option>
                                    {governoratesList.map(gov => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>

                            <input type="text" name="postalCode" placeholder="Postal code (optional)" className="checkout-input" value={formData.postalCode} onChange={handleChange} />
                        </div>

                        <input type="tel" name="phone" placeholder="Phone" className="checkout-input" value={formData.phone} onChange={handleChange} required />

                        <label className="checkout-checkbox" style={{ marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                name="saveInfo"
                                checked={formData.saveInfo}
                                onChange={handleChange}
                            />
                            Save this information for next time
                        </label>


                        {/* Payment Method Section */}
                        <div className="payment-method-section">
                            <label className={`payment-option-card ${formData.payment === 'cod' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={handleChange} />
                                <div className="payment-details">
                                    <span className="payment-title">Cash on Delivery (COD)</span>
                                </div>
                            </label>

                            <label className={`payment-option-card ${formData.payment === 'card' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={handleChange} />
                                <div className="payment-details">
                                    <span className="payment-title">Credit card / Debit card</span>
                                </div>
                            </label>
                        </div>

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Complete order'}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: SUMMARY */}
                <div className="checkout-summary-section">
                    <div className="checkout-items">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item">
                                <div className="item-thumbnail">
                                    <img src={item.image} alt={item.name} />
                                    <span className="item-qty-badge">{item.quantity}</span>
                                </div>
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                </div>
                                <span className="item-price">E£{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-discount">
                        <input
                            type="text"
                            placeholder="Discount code or gift card"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className={couponInput.length > 0 ? 'active' : ''}
                        >
                            Apply
                        </button>
                    </div>

                    <div className="checkout-totals">
                        <div className="summary-row">
                            <span>Subtotal · {cart.reduce((a, b) => a + b.quantity, 0)} items</span>
                            <span>E£{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>E£{shippingCost.toFixed(2)}</span>
                        </div>
                        {activeDiscount && (
                            <div className="summary-row" style={{ color: '#e74c3c' }}>
                                <span>Discount ({activeDiscount.code})</span>
                                <span>-E£{activeDiscount.amount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span><span className="total-currency">EGP</span> E£{finalTotalValue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
