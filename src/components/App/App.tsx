import React, { useEffect, lazy, Suspense, ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import { selectIsModalOpen, selectDarkMode } from "../../redux/ui/selectors";
import { apiRefreshUser } from "../../redux/auth/operations";

import LoginPage from "../../pages/LoginPage/LoginPage";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";
import ContactsPage from "../../pages/ContactsPage/ContactsPage";

import type { AppDispatch } from "../../redux/store";

import "./App.css";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const Layout = lazy(() => import("../Layout/Layout"));
const RestrictedRoute = lazy(() => import("../RestrictedRoute/RestrictedRoute"));
const PrivateRoute = lazy(() => import("../PrivateRoute/PrivateRoute"));

function App(): ReactElement {
const dispatch = useDispatch<AppDispatch>();
const isAnyModalOpen = useSelector(selectIsModalOpen);
const darkMode = useSelector(selectDarkMode);

const handleIsModalOpen = (t: ReactElement, r: ReactElement): ReactElement =>
    isAnyModalOpen ? r : t;
    
useEffect(() => {
    import('../../pages/RegistrationPage/RegistrationPage');
    import('../../pages/LoginPage/LoginPage');
}, []);

useEffect(() => {
    dispatch(apiRefreshUser());
}, [dispatch]);

useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
}, [darkMode]);

return (
    <Suspense fallback={<div>Loading...</div>}>
    <Layout>
        {handleIsModalOpen(
        <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
            style: {
                background: "var(--modal_bg)",
                color: "var(--text)",
                borderRadius: "10px",
                boxShadow: "var(--shadow)",
            },
            }}
        />,
        <Toaster
            position="top-right"
            reverseOrder={true}
            toastOptions={{
            style: {
                background: "var(--modal_bg)",
                color: "var(--text)",
                borderRadius: "10px",
                boxShadow: "var(--shadow)",
            },
            }}
        />
        )}

        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
            path="/contacts"
            element={
            <PrivateRoute>
                <ContactsPage />
            </PrivateRoute>
            }
        />
        <Route
            path="/register"
            element={
            <RestrictedRoute>
                <RegistrationPage />
            </RestrictedRoute>
            }
        />
        <Route
            path="/login"
            element={
            <RestrictedRoute>
                <LoginPage />
            </RestrictedRoute>
            }
        />
        <Route path="*" element={<HomePage />} />
        </Routes>
    </Layout>
    </Suspense>
);
}

export default App;