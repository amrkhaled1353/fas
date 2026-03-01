import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('anwar_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [settings, setSettings] = useState({ marqueeText: '', shippingCost: 0 });
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false); // New state for slide-out cart
    const [checkoutNote, setCheckoutNote] = useState('');
    const [activeDiscount, setActiveDiscount] = useState(null); // { code, amount }
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('anwar_wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedGovernorate, setSelectedGovernorate] = useState('');

    // Fetch data from json-server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, banRes, setRes, coupRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/products.json`),
                    fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/categories.json`),
                    fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/banners.json`),
                    fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/settings.json`),
                    fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}/coupons.json`)
                ]);

                if (prodRes.ok) {
                    const data = await prodRes.json();
                    setProducts(data ? (Array.isArray(data) ? data : Object.values(data)).filter(Boolean) : []);
                }
                if (catRes.ok) {
                    const data = await catRes.json();
                    setCategories(data ? (Array.isArray(data) ? data : Object.values(data)).filter(Boolean) : []);
                }
                if (banRes.ok) {
                    const data = await banRes.json();
                    setBanners(data ? (Array.isArray(data) ? data : Object.values(data)).filter(Boolean) : []);
                }
                if (coupRes.ok) {
                    const data = await coupRes.json();
                    let couponsArray = [];
                    if (data) {
                        couponsArray = Array.isArray(data) ? data : Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    }
                    setCoupons(couponsArray);
                }
                if (setRes.ok) setSettings(await setRes.json() || { marqueeText: '', shippingCost: 0 });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    const toggleCart = (isOpen) => {
        setIsCartOpen(isOpen !== undefined ? isOpen : !isCartOpen);
    };

    const clearCart = () => {
        setCart([]);
    };

    // --- Cart Persistence ---
    useEffect(() => {
        localStorage.setItem('anwar_cart', JSON.stringify(cart));
    }, [cart]);

    // --- Wishlist Logic ---
    useEffect(() => {
        localStorage.setItem('anwar_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const isExist = prev.some(item => item.id === product.id);
            if (isExist) {
                return prev.filter(item => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const value = {
        products,
        categories,
        banners,
        coupons,
        cart,
        settings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        loading,
        isCartOpen,
        toggleCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isSearchOpen,
        setIsSearchOpen,
        checkoutNote,
        setCheckoutNote,
        activeDiscount,
        setActiveDiscount,
        selectedGovernorate,
        setSelectedGovernorate
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};
