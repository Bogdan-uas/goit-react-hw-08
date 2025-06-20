import React from "react";
import { NavLink } from "react-router-dom";
import css from "./AuthNav.module.css";

export default function AuthNav(): React.ReactElement {
return (
    <nav className={css.nav}>
    <NavLink className={css.link} to="/register">
        Register
    </NavLink>
    <NavLink className={css.link} to="/login">
        Log In
    </NavLink>
    </nav>
);
}