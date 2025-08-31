import React, {
    lazy,
    Suspense,
    useEffect,
    useLayoutEffect,
    useMemo,
} from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import { selectIsModalOpen, selectDarkMode } from "../../redux/ui/selectors";
import { selectIsLoading, selectError } from "../../redux/contacts/selectors";
import { apiRefreshUser } from "../../redux/auth/operations";

import type { AppDispatch } from "../../redux/store";

import Loader from "../Loader/Loader";

import "./App.css";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const ContactsPage = lazy(() => import("../../pages/ContactsPage/ContactsPage"));
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const RegistrationPage = lazy(() => import("../../pages/RegistrationPage/RegistrationPage"));
const Layout = lazy(() => import("../Layout/Layout"));
const RestrictedRoute = lazy(() => import("../RestrictedRoute/RestrictedRoute"));
const PrivateRoute = lazy(() => import("../PrivateRoute/PrivateRoute"));
const ErrorPage = lazy(() => import("../../pages/ErrorPage/ErrorPage"));

function App(): React.ReactElement {
    const dispatch = useDispatch<AppDispatch>();
    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const darkMode = useSelector(selectDarkMode);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(apiRefreshUser());
    }, []);

    useLayoutEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        if ("requestIdleCallback" in window) {
            (window as any).requestIdleCallback(() => {
                import("../../pages/LoginPage/LoginPage");
                import("../../pages/RegistrationPage/RegistrationPage");
            });
        }
    }, []);

    const toasterOptions = useMemo(
        () => ({
            reverseOrder: true,
            toastOptions: {
                style: {
                    background: "var(--modal_bg)",
                    color: "var(--text)",
                    borderRadius: "10px",
                    boxShadow: "var(--shadow)",
                },
            },
        }),
        []
    );

    const toasterPosition = useMemo(
        () => (isAnyModalOpen ? "top-right" : "top-center"),
        [isAnyModalOpen]
    );

    return (
        <>
            {isLoading && <Loader />}
            {error && <ErrorPage error={{ message: error }} />}
            <Suspense fallback={<Loader />}>
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
                    <Route path="*" element={<ErrorPage error={{ message: error ?? undefined }} />} />
                </Routes>
            </Layout>
            </Suspense>
            </>
    );
};

export default App;