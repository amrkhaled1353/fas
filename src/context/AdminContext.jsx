import React, { createContext, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {

    // Generic API calls for admin
    const apiCall = async (endpoint, method = 'GET', body = null) => {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(body && { body: JSON.stringify(body) })
        };
        const response = await fetch(`${import.meta.env.VITE_FIREBASE_DB_URL}${endpoint}.json`, options);
        return response.json();
    };

    const createProduct = (data) => apiCall('/products', 'POST', data);
    const updateProduct = (id, data) => apiCall(`/products/${id}`, 'PUT', data);
    const deleteProduct = (id) => apiCall(`/products/${id}`, 'DELETE');

    const createCategory = (data) => apiCall('/categories', 'POST', data);
    const updateCategory = (id, data) => apiCall(`/categories/${id}`, 'PUT', data);
    const deleteCategory = (id) => apiCall(`/categories/${id}`, 'DELETE');

    const createBanner = (data) => apiCall('/banners', 'POST', data);
    const updateBanner = (id, data) => apiCall(`/banners/${id}`, 'PUT', data);
    const deleteBanner = (id) => apiCall(`/banners/${id}`, 'DELETE');

    const createCoupon = (data) => apiCall('/coupons', 'POST', data);
    const deleteCoupon = (id) => apiCall(`/coupons/${id}`, 'DELETE');

    const updateSettings = (data) => apiCall(`/settings`, 'PUT', data);

    const value = {
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createBanner,
        updateBanner,
        deleteBanner,
        createCoupon,
        deleteCoupon,
        updateSettings
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
