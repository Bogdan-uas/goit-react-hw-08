import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

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
import { Toaster } from 'react-hot-toast';

function App() {
const dispatch = useDispatch();

useEffect(() => {
    dispatch(apiRefreshUser());
}, [dispatch]);

return (
    <Layout>
    <Toaster position="top-center" reverseOrder={false} />
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