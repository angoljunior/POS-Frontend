import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PermissionRoute from "@/components/auth/PermissionRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Products from "@/pages/Products";
import Inventory from "@/pages/Inventory";
import Customers from "@/pages/Customers";
import BarcodeManagement from "@/pages/BarcodeManagement";
import Reports from "@/pages/Reports";
import Sales from "@/pages/Sales";
import Receipts from "@/pages/Receipts";

function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Require login for all dashboard pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <PermissionRoute permission="dashboard.view">
                  <Dashboard />
                </PermissionRoute>
              }
            />

            <Route
              path="/pos"
              element={
                <PermissionRoute permission="sales.create">
                  <POS />
                </PermissionRoute>
              }
            />

            <Route
              path="/products"
              element={
                <PermissionRoute permission="products.view">
                  <Products />
                </PermissionRoute>
              }
            />

            <Route
              path="/inventory"
              element={
                <PermissionRoute permission="inventory.view">
                  <Inventory />
                </PermissionRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <PermissionRoute permission="customers.view">
                  <Customers />
                </PermissionRoute>
              }
            />

            <Route
              path="/barcodes"
              element={
                <PermissionRoute permission="barcodes.view">
                  <BarcodeManagement />
                </PermissionRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PermissionRoute permission="reports.view">
                  <Reports />
                </PermissionRoute>
              }
            />

            <Route path="/sales" element={<PermissionRoute permission="sales.view"><Sales /></PermissionRoute>} />

            <Route
              path="/receipts"
              element={
                <PermissionRoute permission="receipts.view">
                  <Receipts />
                </PermissionRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
