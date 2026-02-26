import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, User, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const MobileBottomNav = () => {
    const { setIsSearchOpen } = useStore();
    return (
        <nav className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                <Home size={22} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/collections" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Grid size={22} />
                <span>Store</span>
            </NavLink>
            <button className="bottom-nav-item" onClick={() => setIsSearchOpen(true)}>
                <Search size={22} />
                <span>Search</span>
            </button>
            <NavLink to="/wishlist" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Heart size={22} />
                <span>Wishlist</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <User size={22} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default MobileBottomNav;
