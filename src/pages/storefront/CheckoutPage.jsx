import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { cart, settings, clearCart } = useStore();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: ''
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = settings?.shippingCost || 0;

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
            total: total + shipping,
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
                navigate(currentUser ? '/profile/orders' : '/');
            } else {
                throw new Error("Failed to place order");
            }
        } catch (err) {
            alert("Error placing order: " + err.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (cart.length === 0) {
        return (
            <div className="checkout-empty container">
                <h2>Your cart is empty</h2>
                <Link to="/collections" className="btn-primary">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <div className="checkout-layout">
                {/* Form Section */}
                <div className="checkout-form-section">
                    <h2>Billing Details</h2>
                    {!currentUser && (
                        <div className="checkout-auth-notice">
                            Have an account? <Link to="/login">Click here to login</Link> for faster checkout and order tracking.
                        </div>
                    )}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required />
                        <select name="city" value={formData.city} onChange={handleChange} required>
                            <option value="">Select City / Governorate</option>
                            <option value="Cairo">Cairo</option>
                            <option value="Giza">Giza</option>
                            <option value="Alexandria">Alexandria</option>
                        </select>
                        <div className="payment-method-section">
                            <h3>Payment Method</h3>
                            <div className="payment-options-grid">
                                <label className={`payment-option-card ${formData.payment === 'cod' ? 'selected' : ''}`}>
                                    <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod' || !formData.payment} onChange={handleChange} />
                                    <div className="payment-card-content">
                                        <div className="payment-icon">💵</div>
                                        <div className="payment-details">
                                            <span className="payment-title">Cash on Delivery</span>
                                            <span className="payment-desc">Pay when your order arrives</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`payment-option-card ${formData.payment === 'card' ? 'selected' : ''}`}>
                                    <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={handleChange} />
                                    <div className="payment-card-content">
                                        <div className="payment-icon">💳</div>
                                        <div className="payment-details">
                                            <span className="payment-title">Credit / Debit Card</span>
                                            <span className="payment-desc">Powered securely by Paymob</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`payment-option-card ${formData.payment === 'wallet' ? 'selected' : ''}`}>
                                    <input type="radio" name="payment" value="wallet" checked={formData.payment === 'wallet'} onChange={handleChange} />
                                    <div className="payment-card-content">
                                        <div className="payment-icon">📱</div>
                                        <div className="payment-details">
                                            <span className="payment-title">Mobile Wallets</span>
                                            <span className="payment-desc">Vodafone Cash, Orange, etc.</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="block-btn place-order-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                {/* Order Summary Section */}
                <div className="checkout-summary-section">
                    <h3>Your Order</h3>
                    <div className="checkout-items">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item">
                                <div className="item-info">
                                    <span className="item-qty">{item.quantity}x</span>
                                    <span className="item-name">{item.name}</span>
                                </div>
                                <span className="item-price">{item.price * item.quantity} EGP</span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals">
                        <div className="totals-row">
                            <span>Subtotal</span>
                            <span>{total} EGP</span>
                        </div>
                        <div className="totals-row">
                            <span>Shipping</span>
                            <span>{shipping} EGP</span>
                        </div>
                        <div className="totals-row grand-total">
                            <span>Total</span>
                            <span>{total + shipping} EGP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
