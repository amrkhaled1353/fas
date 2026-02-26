import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
    const { cart, removeFromCart, updateCartQuantity } = useStore();

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page-empty container">
                <h2>Your Cart is Empty</h2>
                <Link to="/collections" className="btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h2>Your Cart</h2>
            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h4>{item.name}</h4>
                                <p>{item.price} EGP</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                                </div>
                            </div>
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{total} EGP</span>
                    </div>
                    <p className="shipping-note">Shipping & taxes calculated at checkout</p>
                    <Link to="/checkout" className="checkout-btn block-btn">Proceed to Checkout</Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
