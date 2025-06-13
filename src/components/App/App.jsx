import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsModalOpen, selectDarkMode } from "../../redux/ui/selectors.js";

import "./App.css";

import HomePage from "../../pages/HomePage/HomePage";
import ContactsPage from "../../pages/ContactsPage/ContactsPage";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import Layout from "../Layout/Layout";
import { apiRefreshUser } from "../../redux/auth/operations";
import { useEffect } from "react";
import RestrictedRoute from "../RestrictedRoute/RestrictedRoute";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { Toaster } from "react-hot-toast";

function App() {
const dispatch = useDispatch();
const isAnyModalOpen = useSelector(selectIsModalOpen);
const darkMode = useSelector(selectDarkMode);

const handleIsModalOpen = (t, r) => (isAnyModalOpen ? r : t);

useEffect(() => {
    dispatch(apiRefreshUser());
}, [dispatch]);

useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
}, [darkMode]);

return (
    <Layout>
{handleIsModalOpen(
    <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{
            style: {
                background: 'var(--modal_bg)',
                color: 'var(--text)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow)',
            }
        }}
    />,
    <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
            style: {
                background: 'var(--modal_bg)',
                color: 'var(--text)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow)',
            }
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
);
}

export default App;