import React, { useEffect, lazy, Suspense, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { selectIsModalOpen, selectDarkMode } from "../../redux/ui/selectors";
import { apiRefreshUser } from "../../redux/auth/operations";

import type { AppDispatch } from "../../redux/store";

import "./App.css";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const ContactsPage = lazy(() => import("../../pages/ContactsPage/ContactsPage"));
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const RegistrationPage = lazy(() => import("../../pages/RegistrationPage/RegistrationPage"));
const Layout = lazy(() => import("../Layout/Layout"));
const RestrictedRoute = lazy(() => import("../RestrictedRoute/RestrictedRoute"));
const PrivateRoute = lazy(() => import("../PrivateRoute/PrivateRoute"));

function App(): ReactElement {
    const dispatch = useDispatch<AppDispatch>();
    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const darkMode = useSelector(selectDarkMode);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(apiRefreshUser());
    }, [dispatch]);

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        import("../../pages/LoginPage/LoginPage");
        import("../../pages/RegistrationPage/RegistrationPage");
    }, []);

    const toasterOptions = {
        reverseOrder: true,
        toastOptions: {
            style: {
                background: "var(--modal_bg)",
                color: "var(--text)",
                borderRadius: "10px",
                boxShadow: "var(--shadow)",
            },
        },
    };

    const toasterPosition = isAnyModalOpen ? "top-right" : "top-center";

    return (
        <Suspense fallback={<div>{t("app.loading")}</div>}>
            <Layout>
                <Toaster position={toasterPosition} {...toasterOptions} />

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
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Suspense>
    );
}

export default App;