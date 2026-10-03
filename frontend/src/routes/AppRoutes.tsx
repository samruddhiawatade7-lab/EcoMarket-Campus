import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { HomePage } from '../pages/HomePage';
import { ProductListPage } from '../pages/ProductListPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SemesterBooksPage } from '../pages/SemesterBooksPage';
import { FreeCornerPage } from '../pages/FreeCornerPage';
import { ClubsPage } from '../pages/ClubsPage';
import { StudentDashboardPage } from '../pages/StudentDashboardPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { OrderDetailPage } from '../pages/OrderDetailPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ImpactPage } from '../pages/ImpactPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { SellerDashboardPage } from '../pages/seller/SellerDashboardPage';
import { SellerProductsPage } from '../pages/seller/SellerProductsPage';
import { AddEditProductPage } from '../pages/seller/AddEditProductPage';
import { SellerOrdersPage } from '../pages/seller/SellerOrdersPage';

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPendingProductsPage } from '../pages/admin/AdminPendingProductsPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Public & Student Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="semester-books" element={<SemesterBooksPage />} />
        <Route path="free-corner" element={<FreeCornerPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Student & Buyer Protected Routes */}
        <Route path="student-dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
        <Route path="products/new" element={<ProtectedRoute><AddEditProductPage /></ProtectedRoute>} />
        <Route path="products/:id/edit" element={<ProtectedRoute><AddEditProductPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* Seller Portal Protected Routes */}
      <Route path="/seller" element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}><SellerLayout /></ProtectedRoute>}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/new" element={<AddEditProductPage />} />
        <Route path="products/:id/edit" element={<AddEditProductPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products/pending" element={<AdminPendingProductsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
