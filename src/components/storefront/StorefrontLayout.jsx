import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, X, LogOut, Settings, Heart, Sun, Moon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import MobileBottomNav from './MobileBottomNav';

const StorefrontLayout = () => {
    const { cart, toggleCart, settings, wishlist, isSearchOpen, setIsSearchOpen } = useStore();
    const { currentUser, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const closeMenu = () => setIsMobileMenuOpen(false);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div
            className="storefront-app"
            style={{
                '--desktop-cols': settings?.desktopColumns || 4,
                '--mobile-cols': settings?.mobileColumns || 2,
                '--hero-desktop-height': settings?.heroDesktopHeight || '65vh',
                '--hero-mobile-height': settings?.heroMobileHeight || '40vh'
            }}
        >
            {/* Top Announcement Bar */}
            {settings?.marqueeText && (
                <div className="top-announcement">
                    <marquee scrollamount="5">
                        {settings.marqueeText.split('\n').map((sentence, index, array) => (
                            <React.Fragment key={index}>
                                {sentence}
                                {index < array.length - 1 && <span style={{ margin: '0 50px' }}>|</span>}
                            </React.Fragment>
                        ))}
                    </marquee>
                </div>
            )}

            {/* Header */}
            <header className="main-header">
                <div className="header-container">
                    <div className="header-mobile-left">
                        {/* Hamburger Mobile */}
                        <button className="mobile-menu icon-btn" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="logo">
                        <Link to="/">
                            <h2>ANWAR STORE</h2>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="desktop-nav">
                        <nav>
                            <ul>
                                <li><Link to="/collections">All Products</Link></li>
                                <li><Link to="/collections/bestsellers">Best Sellers</Link></li>
                                <li><Link to="/collections/new">New Arrivals</Link></li>
                                <li><Link to="/collections/lenses">Lenses</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Action Icons */}
                    <div className="header-actions">
                        <button className="icon-btn theme-btn" onClick={toggleTheme}>
                            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <button className="icon-btn search-btn" onClick={() => setIsSearchOpen(true)}><Search size={22} /></button>

                        <div className="user-dropdown-wrapper">
                            {currentUser ? (
                                <div className="user-logged-in" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                                    <img src={currentUser.avatar} alt={currentUser.name} className="header-avatar" />
                                    {isUserDropdownOpen && (
                                        <div className="user-dropdown-menu">
                                            <div className="dropdown-user-info">
                                                <p className="user-name">{currentUser.name}</p>
                                                <p className="user-email">{currentUser.email}</p>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)}>
                                                <User size={18} />
                                                <span>Profile</span>
                                            </Link>
                                            <Link to="/profile/orders" onClick={() => setIsUserDropdownOpen(false)}>
                                                <ShoppingCart size={18} />
                                                <span>My Orders</span>
                                            </Link>
                                            <Link to="/admin" onClick={() => setIsUserDropdownOpen(false)}>
                                                <Settings size={18} />
                                                <span>Admin Panel</span>
                                            </Link>
                                            <div className="dropdown-divider"></div>
                                            <button onClick={() => { logout(); setIsUserDropdownOpen(false); }} className="dropdown-logout">
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="icon-btn user-btn" title="Login"><User size={22} /></Link>
                            )}
                        </div>

                        <button className="icon-btn cart-btn" onClick={() => toggleCart()}>
                            <ShoppingCart size={22} />
                            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
                        </button>
                    </div>
                </div>

            </header>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Look & Feel Overlays */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CartDrawer />

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
                <div className="mobile-nav-content" onClick={e => e.stopPropagation()}>
                    <div className="mobile-nav-header">
                        <h3>Menu</h3>
                        <button className="icon-btn" onClick={closeMenu}><X size={24} /></button>
                    </div>
                    <nav className="mobile-nav-links">
                        <ul>
                            <li><Link to="/collections" onClick={closeMenu}>All Products</Link></li>
                            <li><Link to="/collections/bestsellers" onClick={closeMenu}>Best Sellers</Link></li>
                            <li><Link to="/collections/new" onClick={closeMenu}>New Arrivals</Link></li>
                            <li><Link to="/collections/lenses" onClick={closeMenu}>Lenses</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h4>Anwar Store</h4>
                        <p>المتجر الاليكتروني لصيدلية أنور, جميع مستحضرات التجميل الأصلية بأفضل سعر.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/collections/c2">Best Sellers</Link></li>
                            <li><Link to="/collections/c3">New Arrivals</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Customer Service</h4>
                        <ul>
                            <li>Contact Us</li>
                            <li>Shipping Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Anwar Store. All rights reserved.</p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default StorefrontLayout;
